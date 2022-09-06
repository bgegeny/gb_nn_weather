export const getLocalStorageValue = (key: string, defaultValue: any) => {
    if (typeof window === "undefined") {
        return defaultValue;
    }

    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.log(error);
        return defaultValue;
    }
}

export const setLocalStorageValue = (key: string, value: any) => {
    try {
        if (typeof window !== "undefined") {
            window.localStorage.setItem(key, JSON.stringify(value));
        }
    } catch (error) {
        console.log(error);
    }
}
