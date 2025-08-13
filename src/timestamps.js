const now = () => new Date().toISOString();

const minitesText = (mins) => `${mins} ${mins != 1 ? "minutes": "minute"}`;

const inXMins = (mins) => {
    const now = new Date();
    const xMinsLater = new Date(now.getTime() + mins * 60 * 1000);
    const timestamp = Math.floor(xMinsLater.getTime() / 1000);
    return timestamp;
}

module.exports = {
    now,
    minitesText,
    inXMins
}