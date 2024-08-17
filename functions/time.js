module.exports = async function getTime({ timezone, locale }) {
    return `The time in ${timezone}: ${(new Date().toLocaleString(locale, { timeZone: timezone }))}`;
};
