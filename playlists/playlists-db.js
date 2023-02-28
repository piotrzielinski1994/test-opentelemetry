const getPlaylists = () => {
  return [
    {
      id: 1,
      title: 'Playlist 1',
      videoIds: [1, 2, 3],
    },
    {
      id: 2,
      title: 'Playlist 2',
      videoIds: [4, 5, 6],
    },
  ];
};

export default {
  getPlaylists,
};
