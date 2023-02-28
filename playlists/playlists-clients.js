export const videosClient = {
  getVideo: (videoId) => {
    return fetch(`http://videos:3000/videos/${videoId}`).then((res) =>
      res.json()
    );
  },
};
