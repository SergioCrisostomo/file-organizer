function getMemoryUsage() {
  return (process.memoryUsage().heapTotal / 1000000)
    .toFixed(0)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
}

module.exports = getMemoryUsage;
