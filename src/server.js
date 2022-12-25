require("dotenv").config();
const Hapi = require("@hapi/hapi");

const notes = require("./api/albums");
const NotesService = require("./services/postgres/AlbumsService");
const NotesValidator = require("./validator/albums");

const init = async () => {
  const notesService = new NotesService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: true,
    },
  });

  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: NotesValidator,
      },
    },
  ]);

  await server.start();
  // eslint-disable-next-line no-console
  console.log(`Server Berjalan di ${server.info.uri}`);
};

init();
