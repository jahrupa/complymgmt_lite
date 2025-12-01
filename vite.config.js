// import { defineConfig ,loadEnv} from 'vite'
// import react from '@vitejs/plugin-react'
// import { cwd } from 'node:process';
// // https://vite.dev/config/
// export default defineConfig({
//    const env = loadEnv(mode, cwd(), '')
//    return{
//     port: Number(env.VITE_SERVER_PORT),
//     host: true,
//    }
//   plugins: [react()],
//   server:{
//     port:9000,
//     host:true
//   },
// })

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { cwd } from 'node:process';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, cwd(), '')

  return {
    plugins: [
      react(),
    ],
    server: {
      port: Number(env.VITE_SERVER_PORT),
      host: true,
    },
  }
})

