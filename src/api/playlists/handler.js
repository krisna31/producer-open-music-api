/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
class PlaylistsHandler {
  constructor(playlistsService, playlistSongsService, songsService, validator) {
    this._playlistsService = playlistsService;
    this._playlistSongsService = playlistSongsService;
    this._songsService = songsService;
    this._validator = validator;
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this._playlistsService.addPlaylist({ name, owner: credentialId });
    const response = h.response({
      status: "success",
      message: "Playlist berhasil ditambahkan",
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._playlistsService.getPlaylists(credentialId);
    return {
      status: "success",
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistsService.deletePlaylistById(playlistId);
    return {
      status: "success",
      message: "Playlist berhasil dihapus",
    };
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validatePostSongToPlaylistPayload(request.payload);
    const { songId } = request.payload;
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._songsService.getSongById(songId);
    await this._playlistSongsService.addSongsToPlaylist({
      playlistId,
      songId,
    });
    await this._playlistsService.addPlaylistActivity(playlistId, songId, credentialId, "add");
    const response = h.response({
      status: "success",
      message: "Song berhasil ditambahkan ke Playlist",
    });
    response.code(201);
    return response;
  }

  async getSongsFromPlaylistIdHandler(request, h) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const playlist = await this._playlistsService.getPlaylistById(playlistId);
    playlist.songs = await this._playlistSongsService.getSongsFromPlaylists(playlistId);
    return {
      status: "success",
      data: {
        playlist,
      },
    };
  }

  async deleteSongFromPlaylistIdHandler(request, h) {
    this._validator.validatePostSongToPlaylistPayload(request.payload);
    const { playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistSongsService.deleteSongFromPlaylistById(playlistId, songId);
    await this._playlistsService.addPlaylistActivity(playlistId, songId, credentialId, "delete");
    return {
      status: "success",
      message: "Playlist berhasil dihapus",
    };
  }

  async getPlaylistActivityHandler(request) {
    const { playlistId: playlistIdActivity } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistOwner(playlistIdActivity, credentialId);
    const playlist = await this._playlistsService.getPlaylistById(playlistIdActivity);
    const activities = await this._playlistsService.getPlaylistActivitiesById(playlistIdActivity);
    return {
      status: "success",
      data: {
        playlistId: playlist.id,
        activities,
      },
    };
  }
}

module.exports = PlaylistsHandler;
