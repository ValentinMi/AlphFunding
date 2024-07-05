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


export const dateToTimestamp = (dateString: string): number => {
    console.log("toto", dateString);
    const [year, month, day] = dateString.split('-').map(Number);
    const dateObject = new Date(year, month - 1, day);
    return dateObject.getTime() / 1000;
}

export const isDateAtLeastOneWeekInFuture = (dateString: string): boolean => {
    const oneWeekInSeconds = 60 * 60 * 24 * 7;

    const inputDateInTimestamp = dateToTimestamp(dateString);

    const todayTimestamp = new Date().getTime() / 1000;

    console.log(inputDateInTimestamp, todayTimestamp, inputDateInTimestamp - todayTimestamp >= oneWeekInSeconds);

    return inputDateInTimestamp - todayTimestamp >= oneWeekInSeconds;
}

