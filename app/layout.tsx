"use client";
import { ChakraProvider } from "@chakra-ui/react";
import { AlephiumWalletProvider } from "@alephium/web3-react";
import { NodeProvider } from "./contexts/NodeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          <AlephiumWalletProvider
            theme="rounded"
            network="devnet"
            addressGroup={0}
          >
            <NodeProvider>{children}</NodeProvider>
          </AlephiumWalletProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
