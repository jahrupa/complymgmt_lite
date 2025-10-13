// encryption.js
const secretKey = "my-super-secret-key"; // ideally stored securely, not hardcoded

async function getKey() {
  const enc = new TextEncoder();
  const keyBuffer = enc.encode(secretKey);
  return crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptToken(token) {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // random IV
  const key = await getKey();
  const encoded = new TextEncoder().encode(token);

  const cipherBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  const encryptedArray = new Uint8Array(iv.byteLength + cipherBuffer.byteLength);
  encryptedArray.set(iv, 0);
  encryptedArray.set(new Uint8Array(cipherBuffer), iv.byteLength);

  return btoa(String.fromCharCode(...encryptedArray));
}

export async function decryptToken(encryptedToken) {
  const encryptedData = Uint8Array.from(atob(encryptedToken), (c) => c.charCodeAt(0));
  const iv = encryptedData.slice(0, 12);
  const data = encryptedData.slice(12);

  const key = await getKey();
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  return new TextDecoder().decode(decrypted);
}
