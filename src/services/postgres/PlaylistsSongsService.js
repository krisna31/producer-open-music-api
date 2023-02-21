/* eslint-disable object-curly-newline */
const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapDBSongToModel, mapDBSongsToModel } = require("../../utils");

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongsToPlaylist({ playlistId, songId }) {
    const id = `playlistsong-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("Song gagal ditambahkan di Playlist");
    }
    return result.rows[0].id;
  }

  async getSongsFromPlaylists(id) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM playlists
      INNER JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
      INNER JOIN songs ON songs.id = playlist_songs.song_id
      WHERE playlists.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError("Gagal mengambil lagu dri playlist");
    }
    return result.rows;
  }

  async deleteSongFromPlaylistById(playlistId, songId) {
    const query = {
      text: "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Lagu gagal dihapus. Id tidak ditemukan");
    }
  }
}

module.exports = PlaylistsService;
