# Solana Wallet Connect with Mobile Wallet Adapter

A Next.js TypeScript dApp with Solana wallet adapter support, including **Android Mobile Wallet Adapter** for seamless mobile wallet connections.

## Features

- ✅ **Android Mobile Wallet Adapter** - Native Android wallet support via Solana Mobile Wallet Adapter
- ✅ **Desktop & iOS Support** - Phantom and Solflare wallet adapters
- ✅ **Platform Detection** - Automatically detects Android devices and enables Mobile Wallet Adapter
- ✅ **TypeScript** - Fully typed for better developer experience
- ✅ **Next.js 14** - App Router with server components support

## Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

## WalletProvider Integration

The `WalletProvider` is integrated in the root layout (`app/layout.tsx`), providing wallet functionality to all pages in your app.

### Current Integration

The provider is already set up in `app/layout.tsx`:

```tsx
import { WalletProvider } from '@/components/WalletProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
```

### Customization Options

You can customize the WalletProvider with these props:

```tsx
<WalletProvider
  network={WalletAdapterNetwork.Mainnet} // or Devnet, Testnet
  endpoint="https://your-custom-rpc-endpoint.com" // Optional custom RPC endpoint
>
  {children}
</WalletProvider>
```

### Using Wallet in Components

Any component can access wallet functionality using hooks:

```tsx
'use client';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function MyComponent() {
  const { wallet, publicKey, connected } = useWallet();
  const { connection } = useConnection();

  // Your component logic
}
```

## How It Works

### Platform Detection

The app detects Android devices using the `isAndroid()` utility function that checks the user agent:

```typescript
// utils/isAndroid.ts
export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false;
  return /android/.test(window.navigator.userAgent.toLowerCase());
}
```

### Wallet Adapter Selection

The `WalletProvider` component automatically selects the appropriate wallet adapters:

- **Android**: Includes `SolanaMobileWalletAdapter` + Phantom + Solflare
- **Desktop/iOS**: Includes Phantom + Solflare only

This happens in `components/WalletProvider.tsx`:

```tsx
const wallets = useMemo(() => {
  const baseWallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ];

  // Add Mobile Wallet Adapter only on Android
  if (isAndroid()) {
    return [
      new SolanaMobileWalletAdapter({
        appIdentity: {
          name: 'Solana dApp',
          uri: window.location.origin,
          icon: `${window.location.origin}/icon.png`,
        },
      }),
      ...baseWallets,
    ];
  }

  return baseWallets;
}, []);
```

## Mobile Wallet Adapter Configuration

The Mobile Wallet Adapter requires app identity information:

- **name**: Your app name (shown to users)
- **uri**: Your app's origin URL
- **icon**: URL to your app icon (192x192px PNG recommended)

Update these in `components/WalletProvider.tsx` to match your app:

```tsx
new SolanaMobileWalletAdapter({
  appIdentity: {
    name: 'Your App Name',
    uri: 'https://yourapp.com',
    icon: 'https://yourapp.com/icon.png',
  },
})
```

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Build

```bash
npm run build
npm start
```

## Testing on Android

1. Build and deploy your app to a hosting service (Vercel, Netlify, etc.)
2. Access the app from an Android device
3. The Mobile Wallet Adapter will automatically appear in the wallet selection modal
4. Users with compatible Solana mobile wallets (like Saga) can connect natively

## Supported Wallets

### Desktop & iOS
- Phantom
- Solflare

### Android (via Mobile Wallet Adapter)
- All wallets compatible with Solana Mobile Wallet Adapter
- Phantom (if installed on Android)
- Solflare (if installed on Android)
- Native mobile wallets (Saga, etc.)

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with WalletProvider integration
│   ├── page.tsx            # Example page with wallet connection
│   └── globals.css         # Global styles
├── components/
│   └── WalletProvider.tsx  # Wallet provider with Android detection
├── utils/
│   └── isAndroid.ts        # Android detection utility
├── package.json
├── tsconfig.json
└── next.config.js
```

## Important Notes

1. **Mobile Wallet Adapter** only works on Android devices with compatible Solana mobile wallets installed
2. **App Icon**: Make sure to provide a valid icon URL in the Mobile Wallet Adapter config
3. **HTTPS**: Mobile Wallet Adapter requires HTTPS in production
4. **SSR**: The Android detection is client-side only (safe with Next.js)

## Troubleshooting

### Mobile Wallet Adapter not appearing
- Ensure you're on an Android device
- Check that the app is served over HTTPS (required in production)
- Verify the user agent includes "android"

### Wallet connection fails
- Check browser console for errors
- Ensure RPC endpoint is accessible
- Verify wallet adapter versions are compatible

## License

MIT

