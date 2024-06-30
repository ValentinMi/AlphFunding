export const sliceAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const bigIntToNumber = (bigInt: bigint) => {
    return Number(bigInt.toString());
}