const axios = require("axios");

const isHoliday = async (date) => {
  try {
    const year = new Date(date).getFullYear();

    const response = await axios.get(
      "https://calendarific.com/api/v2/holidays",
      {
        params: {
          api_key: process.env.CALENDARIFIC_API_KEY,
          country: process.env.COUNTRY_CODE,
          year: year,
        },
      }
    );

    const holidays = response.data.response.holidays;

    return holidays.some((holiday) => {
      return holiday.date.iso === date;
    });
  } catch (error) {
    console.error(
      "Calendarific error:",
      error.response?.data || error.message
    );

    throw new Error("Unable to check holidays");
  }
};

module.exports = {
  isHoliday,
};