const getVideo = (videoId) => {
  return {
    id: videoId,
    title: `Video ${videoId}`,
  };
};

export default {
  getVideo,
};
