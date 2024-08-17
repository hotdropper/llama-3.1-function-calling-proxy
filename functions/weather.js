module.exports = async function getWeather({ location }) {
    return {
        conditions: 'Sunny',
        temperature: '25',
        measurement: 'celsius',
        plainText: `Weather in ${location}: Sunny, 25°C`
    };
};
