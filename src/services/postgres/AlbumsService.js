const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapDBAlbumToModel, mapDBSongsToModel } = require("../../utils");

class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO albums VALUES($1, $2, $3) RETURNING id",
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Album gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query("SELECT * FROM albums");
    return result.rows.map(mapDBAlbumToModel);
  }

  async getAlbumById(id) {
    // query for album
    const query = {
      text: "SELECT * FROM albums WHERE id = $1",
      values: [id],
    };
    let result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    // query for songs with same album_id
    const querySongs = {
      text: "SELECT * FROM songs WHERE album_id = $1",
      values: [id],
    };
    let songs = await this._pool.query(querySongs);

    // eslint-disable-next-line prefer-destructuring
    result = result.rows.map(mapDBAlbumToModel)[0];
    songs = songs.rows.map(mapDBSongsToModel);
    result.songs = songs;

    return result;
  }

  async editAlbumById(id, { name, year, coverUrl }) {
    const query = {
      text: "UPDATE albums SET name = $1, year = $2, cover_url = $3 WHERE id = $4 RETURNING id",
      values: [name, year, coverUrl, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui Album. Id tidak ditemukan");
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
  }

  async postAlbumLikeById(userId, albumId) {
    const id = `albumlike-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id",
      values: [id, userId, albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("Status Album gagal di perbarui");
    }
    await this._cacheService.delete(`album-likes:${albumId}`);
  }

  async deleteAlbumLikeById(userId, albumId) {
    const query = {
      text: "DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id",
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Status Album gagal di perbarui");
    }

    await this._cacheService.delete(`album-likes:${albumId}`);
  }

  async getAlbumLikeByUserId(userId, albumId) {
    const query = {
      text: "SELECT COUNT(*) FROM user_album_likes WHERE user_id = $1 AND album_id = $2",
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    return result.rows[0].count;
  }

  async getAlbumLikeCountById(id) {
    try {
      const result = await this._cacheService.get(`album-likes:${id}`);

      return {
        likeCount: JSON.parse(result),
        isCache: 1,
      };
    } catch (error) {
      const query = {
        text: "SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1",
        values: [id],
      };

      const result = await this._pool.query(query);
      await this._cacheService.set(`album-likes:${id}`, JSON.stringify(result.rows[0].count));

      return {
        likeCount: result.rows[0].count,
      };
    }
  }
}

module.exports = AlbumsService;
