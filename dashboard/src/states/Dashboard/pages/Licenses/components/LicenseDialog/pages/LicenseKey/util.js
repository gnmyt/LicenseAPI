export const generateCharacter = () => {
    return String.fromCharCode(Math.random() < 0.5 ? Math.floor(Math.random() * 26) + 65 : Math.floor(Math.random() * 26) + 97);
}

export const generateSpecialCharacter = () => {
    const specialChars = "!@#$%^&*()_+-=[]{};':\",./<>?";
    return specialChars[Math.floor(Math.random() * specialChars.length)];
}

export const generateAlphaNumeric = () => {
    const alphanumericChars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphanumericChars[Math.floor(Math.random() * alphanumericChars.length)];
}

export const generateRandom = () => {
    const allChars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{};':\",./<>?";
    return allChars[Math.floor(Math.random() * allChars.length)];
}

export const replaceLicenseDefaults = (defaultKey) => {
    return defaultKey.split('').map(char => {
        switch (char) {
            case 'N':
                return String(Math.floor(Math.random() * 10));
            case 'C':
                return generateCharacter();
            case 'L':
                return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
            case 'U':
                return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
            case 'S':
                return generateSpecialCharacter();
            case 'A':
                return generateAlphaNumeric();
            case 'R':
                return generateRandom();
            default:
                return char;
        }
    }).join('');
}