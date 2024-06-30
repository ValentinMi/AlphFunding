import { Configuration } from "@alephium/cli";

// Settings are usually for configuring
export type Settings = {};

const defaultSettings: Settings = {};

const configuration: Configuration<Settings> = {
  networks: {
    devnet: {
      nodeUrl: "http://localhost:22973",
      privateKeys: [
        "f704ad9b0d1918c5f080d24227b1327b3ec4010efc6bac06643f6872aacd964d", // group 0
      ],
      settings: defaultSettings,
      networkId: 4,
    },

    testnet: {
      nodeUrl:
        (process.env.NODE_URL as string) ??
        "https://wallet-v20.testnet.alephium.org",
      privateKeys:
        process.env.PRIVATE_KEYS === undefined
          ? []
          : process.env.PRIVATE_KEYS.split(","),
      settings: defaultSettings,
    },

    mainnet: {
      nodeUrl:
        (process.env.NODE_URL as string) ??
        "https://wallet-v20.mainnet.alephium.org",
      privateKeys:
        process.env.PRIVATE_KEYS === undefined
          ? []
          : process.env.PRIVATE_KEYS.split(","),
      settings: defaultSettings,
    },
  },
};

export default configuration;
