const routes = (handler) => [
  {
    method: "POST",
    path: "/playlists",
    handler: (request, h) => handler.postPlaylistHandler(request, h),
    options: {
      auth: "openmusic_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists",
    handler: (request, h) => handler.getPlaylistHandler(request, h),
    options: {
      auth: "openmusic_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{playlistId}",
    handler: (request, h) => handler.deletePlaylistByIdHandler(request, h),
    options: {
      auth: "openmusic_jwt",
    },
  },
  {
    method: "POST",
    path: "/playlists/{playlistId}/songs",
    handler: (request, h) => handler.postSongToPlaylistHandler(request, h),
    options: {
      auth: "openmusic_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists/{playlistId}/songs",
    handler: (request, h) => handler.getSongsFromPlaylistIdHandler(request, h),
    options: {
      auth: "openmusic_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{playlistId}/songs",
    handler: (request, h) => handler.deleteSongFromPlaylistIdHandler(request, h),
    options: {
      auth: "openmusic_jwt",
    },
  },
];

module.exports = routes;
