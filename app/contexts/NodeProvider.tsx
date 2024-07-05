import { createContext } from "react";
import { NodeProvider as AlphNodeProvider, web3 } from "@alephium/web3";

export const NodeProviderContext = createContext({
  nodeProvider: new AlphNodeProvider(process.env.NEXT_PUBLIC_NODE_URL!),
});

export const NodeProvider = ({ children }: { children: React.ReactNode }) => {
  const nodeUrl = process.env.NEXT_PUBLIC_NODE_URL;
  const nodeProvider = new AlphNodeProvider(nodeUrl!);
  web3.setCurrentNodeProvider(nodeProvider);

  return (
    <NodeProviderContext.Provider value={{
      nodeProvider
    }}>
      {children}
    </NodeProviderContext.Provider>
  );
}