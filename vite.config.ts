import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split Solana wallet adapters into separate chunk
          'solana-wallets': [
            '@solana/wallet-adapter-react',
            '@solana/wallet-adapter-base',
            '@solana/wallet-adapter-react-ui',
            '@solana/wallet-adapter-wallets',
          ],
          // Split mobile wallet adapter into separate chunk
          'solana-mobile': [
            '@solana-mobile/wallet-adapter-mobile',
          ],
          // Split Solana web3.js into separate chunk
          'solana-web3': [
            '@solana/web3.js',
          ],
        },
      },
    },
    // Increase chunk size warning limit (optional)
    chunkSizeWarningLimit: 600,
  },
  optimizeDeps: {
    exclude: ['@solana-mobile/wallet-adapter-mobile'],
  },
});

