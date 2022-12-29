/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
const AlbumsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "albums",
  version: "1.0.0",
  register: async (server, { service, storageService, albumsService, uploadsValidator, validator }) => {
    const albumsHandler = new AlbumsHandler(service, storageService, albumsService, uploadsValidator, validator);
    server.route(routes(albumsHandler));
  },
};
