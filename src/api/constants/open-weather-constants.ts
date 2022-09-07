export const cityCodes = {
    SZEGED: 715429,
    BUDAPEST: 3054643,
    BAJA: 3055685,
    PECS: 3046526,
    EGER: 721239,
    SOPRON: 3045190,
};

export const openWeatherMapApiKey = 'a23560fa3f2603966851cd344571833b';

export const weatherApiLinks = {
    userLocationData: (unit: string, lat: number, lon: number) => `https://api.openweathermap.org/data/2.5/onecall?units=${unit.toLowerCase()}&lat=${lat}&lon=${lon}&exclude=minutely&appid=${openWeatherMapApiKey}`,
    citiesData: (unit: string) => `https://api.openweathermap.org/data/2.5/group?id=${Object.values(cityCodes).join(',')}&units=${unit.toLowerCase()}&appid=${openWeatherMapApiKey}`,
    positionData: (lat: number, lon: number) => `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${openWeatherMapApiKey}`,
}


