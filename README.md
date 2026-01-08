# Solana Wallet Connect with Mobile Adapter Support

A production-ready React dApp with Solana wallet adapter support that automatically uses **Solana Mobile Wallet Adapter** for Android devices and **Phantom/Solflare** for desktop and iOS.

## Features

- ✅ Automatic Android detection
- ✅ Solana Mobile Wallet Adapter for Android
- ✅ Phantom & Solflare for Desktop & iOS
- ✅ TypeScript support
- ✅ Production-ready code structure

## Installation

```bash
npm install
```

## Project Structure

```
solana-wallet-connect/
├── src/
│   ├── components/
│   │   └── WalletProvider.tsx    # Main wallet provider with conditional logic
│   ├── utils/
│   │   └── deviceDetection.ts    # Android/iOS detection utilities
│   ├── App.tsx                    # Example app component
│   └── main.tsx                   # Entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Integration Guide

### 1. Wrap Your App with WalletProvider

The `WalletContextProvider` component should wrap your entire application at the root level. This is typically done in your main entry file or App component.

**Example Integration:**

```tsx
import { WalletContextProvider } from './components/WalletProvider';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

function App() {
  return (
    <WalletContextProvider network={WalletAdapterNetwork.Mainnet}>
      {/* Your app components */}
    </WalletContextProvider>
  );
}
```

### 2. Use Wallet Hooks in Your Components

Inside any component that's a child of `WalletContextProvider`, you can use the wallet hooks:

```tsx
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

function MyComponent() {
  const { publicKey, connected, disconnect } = useWallet();
  
  return (
    <div>
      <WalletMultiButton />
      {connected && <p>Connected: {publicKey?.toBase58()}</p>}
    </div>
  );
}
```

### 3. Configuration Options

#### Network Selection

```tsx
// Use mainnet
<WalletContextProvider network={WalletAdapterNetwork.Mainnet}>

// Use devnet (for testing)
<WalletContextProvider network={WalletAdapterNetwork.Devnet}>

// Use testnet
<WalletContextProvider network={WalletAdapterNetwork.Testnet}>
```

#### Custom RPC Endpoint

```tsx
<WalletContextProvider 
  network={WalletAdapterNetwork.Mainnet}
  endpoint="https://api.mainnet-beta.solana.com"
>
```

#### Customize Mobile Wallet Adapter Identity

Edit `src/components/WalletProvider.tsx` and update the `appIdentity` object:

```tsx
new SolanaMobileWalletAdapter({
  appIdentity: {
    name: 'Your dApp Name',
    uri: 'https://your-dapp-url.com',
    icon: 'https://your-dapp-url.com/icon.png',
  },
})
```

## How It Works

1. **Device Detection**: The `isAndroidDevice()` utility function checks the user agent to detect Android devices.

2. **Conditional Wallet Loading**:
   - **Android**: Loads `SolanaMobileWalletAdapter` only
   - **Desktop & iOS**: Loads `PhantomWalletAdapter` and `SolflareWalletAdapter`

3. **Automatic Connection**: The `autoConnect` prop enables automatic wallet reconnection on page reload.

## Android Requirements

For Android users to connect their wallets:

1. They must have a Solana Mobile Wallet installed (e.g., Solflare Mobile, Phantom Mobile)
2. The wallet must support the Solana Mobile Wallet Adapter protocol
3. The dApp must be served over HTTPS (required for mobile wallet connections)

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Testing on Android

1. Build your app: `npm run build`
2. Serve it over HTTPS (use a service like Vercel, Netlify, or ngrok)
3. Open the URL on an Android device
4. The app will automatically detect Android and use the Mobile Wallet Adapter

## Production Checklist

- [ ] Update `appIdentity` in `WalletProvider.tsx` with your dApp details
- [ ] Set network to `WalletAdapterNetwork.Mainnet` for production
- [ ] Configure custom RPC endpoint if needed
- [ ] Test on actual Android devices
- [ ] Ensure HTTPS is enabled
- [ ] Update app name and metadata

## Troubleshooting

### Android wallet not connecting

- Ensure the app is served over HTTPS
- Check that a compatible Solana mobile wallet is installed
- Verify the `appIdentity` configuration is correct

### Desktop wallets not showing

- Check browser console for errors
- Ensure wallet extensions are installed
- Try refreshing the page

## License

MIT

