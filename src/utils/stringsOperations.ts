interface StringPassed {
    stringPassed: string;
    referenceString: string;
}

export const stringContains = ({ stringPassed, referenceString }: StringPassed): boolean => {
    return referenceString.includes(stringPassed);
};



