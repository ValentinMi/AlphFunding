export const sliceAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const bigIntToNumber = (bigInt: bigint) => {
    return Number(bigInt.toString());
}

export const truncateText = (text: string, maxLength: number): string  => {
    if (text.length <= maxLength) {
        return text;
    }

    let truncatedText = text.slice(0, maxLength);
    const lastSpaceIndex = truncatedText.lastIndexOf(' ');

    if (lastSpaceIndex !== -1) {
        truncatedText = truncatedText.slice(0, lastSpaceIndex);
    }

    return truncatedText + '...';
}