/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
const mapDBAlbumToModel = ({ id, name, year, cover_url }) => ({
  id,
  name,
  year,
  coverUrl: cover_url,
});

const mapDBSongsToModel = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

const mapDBSongToModel = ({ id, title, year, performer, genre, duration, album_id }) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

module.exports = { mapDBAlbumToModel, mapDBSongToModel, mapDBSongsToModel };
