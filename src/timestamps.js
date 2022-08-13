const now = () => new Date().toISOString();

const minitesText = (mins) => `${mins} ${mins != 1 ? "minutes": "minute"}`;

module.exports = {
    now,
    minitesText
}