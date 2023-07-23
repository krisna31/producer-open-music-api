// config
const ClientError = require("../../exceptions/ClientError");
const config = require("../../utils/config");

class AlbumHandler {
  constructor(service, storageService, albumsService, uploadsValidator, validator) {
    this._service = service;
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._uploadsValidator = uploadsValidator;
    this._validator = validator;
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: "success",
      message: "Album berhasil ditambahkan",
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumsHandler() {
    const albums = await this._service.getAlbums();
    return {
      status: "success",
      data: {
        albums,
      },
    };
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);

    return {
      status: "success",
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._service.editAlbumById(id, request.payload);

    return {
      status: "success",
      message: "Album berhasil diperbarui",
    };
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return {
      status: "success",
      message: "Album berhasil dihapus",
    };
  }

  async postUploadCoverAlbumByIdHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;

    this._uploadsValidator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const coverUrl = `http://${config.app.host}:${config.app.port}/upload/images/${filename}`;

    const { name, year } = await this._albumsService.getAlbumById(id);
    await this._albumsService.editAlbumById(id, { name, year, coverUrl });

    const response = h.response({
      status: "success",
      message: "Sampul berhasil diunggah",
    });

    response.code(201);
    return response;
  }

  async postAlbumLikeByIdHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._albumsService.getAlbumById(albumId);

    const albumUserLike = await this._albumsService.getAlbumLikeByUserId(credentialId, albumId);

    if (albumUserLike > 0) {
      throw new ClientError("Like gagal ditambahkan. User sudah memberikan like pada album ini");
    } else {
      await this._albumsService.postAlbumLikeById(credentialId, albumId);
    }

    const response = h.response({
      status: "success",
      message: "Like pada album berhasil diperbarui",
    });

    response.code(201);
    return response;
  }

  async deleteAlbumLikeByIdHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._albumsService.getAlbumById(albumId);

    await this._albumsService.deleteAlbumLikeById(credentialId, albumId);

    const response = h.response({
      status: "success",
      message: "Like pada album berhasil dihapus",
    });

    response.code(200);
    return response;
  }

  async getAlbumLikeByIdHandler(request, h) {
    const { id } = request.params;

    const { likeCount, isCache } = await this._albumsService.getAlbumLikeCountById(id);

    const response = h.response({
      status: "success",
      data: {
        likes: Number(likeCount),
      },
    });

    if (isCache) {
      response.header("X-Data-Source", "cache");
    }

    return response;
  }
}

module.exports = AlbumHandler;
