class ExportsHandler {
  constructor(playlistsService, playlistSongsService, producerService, validator) {
    this._playlistsService = playlistsService;
    this._playlistSongsService = playlistSongsService;
    this._producerService = producerService;
    this._validator = validator;
  }

  async postExportPlaylistByIdHandler(request, h) {
    this._validator.validateExportNotesPayload(request.payload);
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const playlistById = await this._playlistsService.getPlaylistById(playlistId);
    const songs = await this._playlistSongsService.getSongsFromPlaylistId(playlistId);
    const message = {
      playlistTarget: {
        playlist: {
          id: playlistById.id,
          name: playlistById.name,
          songs,
        },
      },
      targetEmail: request.payload.targetEmail,
    };

    await this._producerService.sendMessage("export:playlists", JSON.stringify(message));

    const response = h.response({
      status: "success",
      message: "Permintaan Anda dalam antrian",
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
