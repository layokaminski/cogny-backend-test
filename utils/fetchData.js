const axios = require('axios');

const fetchData = async () => {
  try {
      const { data } = await axios.get('https://datausa.io/api/data?drilldowns=Nation&measures=Population');
      return data
  } catch (error) {
      return console.error(error.message);
  }
}

module.exports = {
  fetchData,
}