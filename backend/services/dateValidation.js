const isWeekend = (dateString) => {
  const date = new Date(`${dateString}T00:00:00`);

  const day = date.getDay();

  return day === 0 || day === 6;
};

module.exports = {
  isWeekend,
};