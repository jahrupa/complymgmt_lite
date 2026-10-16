# CI/CD: build, deploy and roll back

| Branch    | Environment | Deploys                              |
|-----------|-------------|--------------------------------------|
| `develop` | staging     | on every push (merged PR)            |
| `main`    | production  | on every push, after approval        |

```
PR into develop/main ──► CI: install · lint (no new errors) · build
                                   │ merge
                                   ▼
push to develop/main ──► Deploy: plan ─► build (once, with that env's VITE_* values)
                                              │  artifact: <release>.tar.gz (kept 30 days)
                                              ▼
                         deploy (production waits for approval)
                           upload ─► activate (switch `current` symlink) ─► health check
                                                                               │ fails
                                                                               ▼
                                                     automated rollback to the release live before
```

The servers serve **static files** (nginx); no Node process runs on them. A release is a directory, and
going live or rolling back is an atomic symlink switch, so neither needs a web server restart or sudo.

## Files

| Path | What it does |
|------|--------------|
| `.github/workflows/ci.yml` | Pull requests into `develop`/`main`: install, lint gate, build. |
| `.github/workflows/deploy.yml` | Push to `develop`/`main` (or *Run workflow* on them): build, deploy, health check, automated rollback. |
| `.github/workflows/rollback.yml` | Manual rollback (or just list releases) for either environment. |
| `.github/actions/ssh-setup` | Writes the deploy key and pinned host key under the runner's temp dir. |
| `.github/scripts/lint-ratchet.sh` | Fails a PR only if it adds ESLint errors (the codebase still has ~330 old ones). |
| `.github/scripts/runner-json.sh` | Turns `STAGING_RUNNER`/`PRODUCTION_RUNNER` into a `runs-on` value. |
| `deploy/remote.sh` | Runs on the server: `activate`, `rollback`, `list`, `current`. Uploaded on every run. |
| `deploy/healthcheck.sh` | Runs on the runner: waits for `/version.json` to report the new release, then checks it stays healthy. |
| `deploy/nginx/complymgmt_lite.conf` | Example nginx site (SPA fallback, caching, old-chunk fallback). |

### Server layout (`DEPLOY_PATH`, e.g. `/var/www/complymgmt_lite`)

```
releases/20261016T101500Z-c0bacf1/   one directory per build; the 5 newest are kept (KEEP_RELEASES)
current  -> releases/<id>            nginx serves this
previous -> releases/<id>            where "rollback" goes; never pruned
incoming/                            uploads waiting to be unpacked
deploy.log                           who activated / rolled back what, and when
```

Every release contains `version.json` (release id, commit, branch, build time, run link), so
`curl https://<host>/version.json` always tells you exactly what a server is running.

## Rollback

**Automated.** After switching, `deploy.yml` waits up to 90s for `/version.json` to report the new
release, then requires 5 healthy checks in a row (app shell at `/` and the right version), 6s apart.
If anything fails after the switch, or the run is cancelled, it switches back to the release that was
live before, health-checks that, and marks the run failed (GitHub emails the person who pushed).
A build that is broken never goes live in the first place: `remote.sh` refuses a release without
`index.html`/`version.json`, and `current` is only switched after the release is fully unpacked.

**Manual, three ways** (fastest first):

1. **Rollback workflow**: *Actions → Rollback → Run workflow*. Pick the environment; leave *release*
   empty to go back one step (run it again to go forward), or paste a release id. Tick *list releases
   only* first if you want to see what's on the server. Takes seconds: nothing is rebuilt.
2. **Re-run an old Deploy run**: open the Deploy run of the version you want and *Re-run jobs →
   deploy*. It re-uses that run's artifact (30 days), so it works even after the release was pruned
   from the server. If the release is still on the server it just switches to it.
3. **Revert in git**: `git revert` the bad merge on `develop`/`main` and push. Slowest, but it keeps
   the branch and the servers in agreement; do this after 1 or 2 so the next deploy doesn't bring the
   problem back.

On the server itself (e.g. GitHub is down): `bash $DEPLOY_PATH/incoming/remote.sh list $DEPLOY_PATH`,
then `... rollback $DEPLOY_PATH [<release-id>]`.

## One-time server setup (each server, cloud or on-prem)

Any Linux server with nginx (or any web server that can serve a directory and fall back to
`index.html`). Staging and production can share a host with different `DEPLOY_PATH`s and server names.

```bash
# 1. A deploy user that owns the app directory (no sudo needed for deploys)
sudo useradd --create-home --shell /bin/bash deploy        # or reuse an existing user
sudo mkdir -p /var/www/complymgmt_lite
sudo chown deploy:deploy /var/www/complymgmt_lite
#    nginx (user nginx / www-data) must be able to read it:
sudo chmod 755 /var/www/complymgmt_lite

# 2. A key just for CI (on your machine), authorised for the deploy user
ssh-keygen -t ed25519 -N '' -C "github-actions complymgmt_lite <env>" -f ./complymgmt_lite_<env>
sudo -u deploy mkdir -p ~deploy/.ssh && sudo -u deploy chmod 700 ~deploy/.ssh
cat ./complymgmt_lite_<env>.pub | sudo -u deploy tee -a ~deploy/.ssh/authorized_keys
#    Optional hardening in authorized_keys: from="<runner IPs>",no-port-forwarding,no-pty ssh-ed25519 ...

# 3. nginx site
sudo cp deploy/nginx/complymgmt_lite.conf /etc/nginx/conf.d/complymgmt_lite.conf   # edit server_name/TLS/root
sudo nginx -t && sudo systemctl reload nginx
#    RHEL/Fedora with SELinux: let nginx read the directory
sudo semanage fcontext -a -t httpd_sys_content_t '/var/www/complymgmt_lite(/.*)?' && sudo restorecon -R /var/www/complymgmt_lite

# 4. The host key to pin in GitHub (run from a trusted network, check the fingerprint)
ssh-keyscan -p 22 <host>
```

Server needs: `bash`, `tar`, `flock` (util-linux), and GNU `mv` (`-T`). No Node.js.

### Moving staging off the Vite dev server

Today staging runs `vite --mode stage` (a dev server) under supervisord from a copy of the source.
After the first successful staging deploy has populated `/var/www/complymgmt_lite/current`:

1. Point the staging host at the static files with the nginx site above. If nginx currently proxies
   to the Vite port, replace that `location`/`proxy_pass` with the `root` + `try_files` setup.
2. `sudo supervisorctl stop complymgmt_lite`, then remove `/etc/supervisord.d/complymgmt_lite.ini`
   and `sudo supervisorctl update`.
3. Copy the old `.env.stage` contents into the `STAGING_ENV_FILE` secret, then delete the old source
   files (`src/`, `node_modules/`, …) from the folder, keeping `releases/`, `current`, `previous`,
   `incoming/` and `deploy.log`. Using a fresh `DEPLOY_PATH` (e.g. `/var/www/complymgmt_lite_web`)
   avoids mixing the two during the switch.

## GitHub setup

**Settings → Secrets and variables → Actions → Repository secrets**

| Secret | Value |
|--------|-------|
| `STAGING_ENV_FILE` | Full contents of `.env.stage` (`VITE_API_BASE_URL=...`, `VITE_SECRET=...`) |
| `PRODUCTION_ENV_FILE` | Full contents of `.env.prod` |

These are repository secrets (not environment secrets) so the build can run before production approval.
Remember that every `VITE_*` value ends up in the public JavaScript bundle; nothing in these files is
hidden from users, so never put server-side secrets there.

**Settings → Environments**: create `staging` and `production`, each with:

| Kind | Name | Value |
|------|------|-------|
| secret | `DEPLOY_HOST` | Server host name or IP (as reachable from the runner) |
| secret | `DEPLOY_USER` | `deploy` |
| secret | `DEPLOY_SSH_KEY` | Private key from step 2 |
| secret | `DEPLOY_KNOWN_HOSTS` | Output of `ssh-keyscan` from step 4 |
| variable | `DEPLOY_PATH` | `/var/www/complymgmt_lite` |
| variable | `APP_URL` | Public URL the health check hits, e.g. `https://stage.example.com` |
| variable | `DEPLOY_PORT` | Optional, default `22` |
| variable | `KEEP_RELEASES` | Optional, default `5` |

On **production** also set:
- *Required reviewers*: who approves production deploys (and production rollbacks, since the Rollback
  workflow uses the same environment). Turn off *Prevent self-review* if one person must be able to
  roll back alone in an emergency.
- *Deployment branches and tags*: selected branches → `main`. Staging: `develop`.

**Branch protection** (Settings → Rules) on `develop` and `main`: require a pull request and the
*CI / Lint and build* check; block force pushes.

### Cloud or on-prem: where the deploy job runs

Repository variables `STAGING_RUNNER` and `PRODUCTION_RUNNER` (Settings → Variables) choose it:

- **Empty / `ubuntu-latest`** (default): GitHub's runners SSH to the server. The server's SSH port must
  be reachable from the internet (restrict it to [GitHub's IP ranges](https://api.github.com/meta) or
  use a bastion), and `APP_URL` must be publicly reachable for the health check.
- **Self-hosted runner** for servers inside an office/datacenter network with no inbound access:
  install a [GitHub Actions runner](https://docs.github.com/actions/hosting-your-own-runners) on any
  machine in that network (it only makes outbound HTTPS connections to GitHub), give it a label, and
  set e.g. `PRODUCTION_RUNNER=self-hosted,onprem`. The runner needs `bash`, `ssh`, `scp`, `curl` and
  `tar`; `DEPLOY_HOST` and `APP_URL` can then be internal addresses. The build still runs on
  GitHub-hosted runners, so the on-prem machine needs no Node.js.

Each environment picks independently, e.g. staging in the cloud and production on-prem.

## Verifying a setup

1. Push to `develop` (or *Run workflow* on `develop`). Approve nothing: staging has no reviewers.
2. The run summary shows the release and the releases on the server; `curl $APP_URL/version.json`
   shows the same release.
3. *Rollback → staging*, empty release: the summary shows the previous release live; run it again
   to go back.
4. To see the automated rollback once: temporarily set staging's `APP_URL` to a wrong path
   (e.g. `https://stage.example.com/nope`) and push. The health check fails and the run switches back
   to the earlier release. The rollback's own health check fails too (same wrong URL), so confirm with
   the *Releases on the server* list in the summary, where the earlier release is `<- current`. Then
   restore `APP_URL`.
