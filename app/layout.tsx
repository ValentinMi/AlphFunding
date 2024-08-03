"use client";
import { ChakraProvider } from "@chakra-ui/react";
import { AlephiumWalletProvider } from "@alephium/web3-react";
import { NodeProvider, web3 } from "@alephium/web3";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nodeUrl = process.env.NEXT_PUBLIC_NODE_URL;
  const nodeProvider = new NodeProvider(nodeUrl!);
  web3.setCurrentNodeProvider(nodeProvider);

  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          <AlephiumWalletProvider
            theme="rounded"
            network="devnet"
            addressGroup={0}
          >
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </AlephiumWalletProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
