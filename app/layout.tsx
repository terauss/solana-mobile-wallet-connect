import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// Dynamically import WalletProvider with SSR disabled
// This prevents wallet adapters from being initialized on the server
const WalletProvider = dynamic(
  () => import('@/components/WalletProvider').then((mod) => mod.WalletProvider),
  { 
    ssr: false,
    loading: () => null // Don't show loading state
  }
);

export const metadata: Metadata = {
  title: 'Solana Wallet Connect',
  description: 'Solana dApp with Mobile Wallet Adapter support',
};

/**
 * Root layout component
 * 
 * This is where WalletProvider is integrated at the app level.
 * All pages will have access to wallet functionality.
 * 
 * To customize the RPC endpoint or network, modify the WalletProvider props:
 * - network: WalletAdapterNetwork.Mainnet | WalletAdapterNetwork.Devnet | WalletAdapterNetwork.Testnet
 * - endpoint: Custom RPC endpoint URL
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}

