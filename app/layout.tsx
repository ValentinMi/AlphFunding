"use client";
import { ChakraProvider } from "@chakra-ui/react";
import { AlephiumWalletProvider } from "@alephium/web3-react";
import { NodeProvider, web3 } from "@alephium/web3";

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
            {children}
          </AlephiumWalletProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
