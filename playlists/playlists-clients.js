const axios = require('axios');

const videosClient = {
  getVideo: async (videoId) => {
    const response = await axios.get(`http://videos:3000/videos/${videoId}`);
    return response.data;
  },
};

module.exports = {
  videosClient,
};
