const dotenv = require('dotenv');
const { wait } = require('./videos-helpers.js');

dotenv.config();

const hasError = process.env.HAS_ERROR === 'true';
const hasDelay = process.env.HAS_DELAY === 'true';

const getVideo = async (videoId) => {
  if (hasError && videoId === 6) throw 'Exception';
  if (hasDelay && videoId === 5) await wait(5000);

  return {
    id: videoId,
    title: `Video ${videoId}`,
  };
};

module.exports = {
  getVideo,
};
