import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { WalletContextProvider } from './components/WalletProvider';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { isAndroidDevice } from './utils/deviceDetection';

/**
 * Main App component demonstrating wallet integration
 * Replace this with your actual app component
 */
function AppContent() {
  const { publicKey, connected, disconnect } = useWallet();
  const isAndroid = isAndroidDevice();

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '1200px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>Solana Wallet Connect</h1>
        <p style={{ color: '#666' }}>
          Device: {isAndroid ? 'Android' : 'Desktop/iOS'}
        </p>
      </header>

      <div style={{ marginBottom: '2rem' }}>
        <WalletMultiButton />
      </div>

      {connected && publicKey && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
          <h2>Wallet Connected</h2>
          <p><strong>Public Key:</strong> {publicKey.toBase58()}</p>
          <button 
            onClick={disconnect}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Disconnect
          </button>
        </div>
      )}

      {!connected && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#fff3cd', 
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
          <p>Please connect your wallet to continue.</p>
          {isAndroid && (
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              <strong>Android:</strong> Using Solana Mobile Wallet Adapter
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * App component wrapped with WalletProvider
 * This is the entry point for your application
 */
function App() {
  // Configure network (change to WalletAdapterNetwork.Mainnet for production)
  const network = WalletAdapterNetwork.Devnet;
  
  // Optional: Use custom RPC endpoint
  // const endpoint = 'https://api.mainnet-beta.solana.com';

  return (
    <WalletContextProvider network={network}>
      <AppContent />
    </WalletContextProvider>
  );
}

export default App;

