# USE IT ON YOUR RISK

<b>⚠️I'm not responsible for anything that happen to you if you use this for cheating purposes.⚠️</b>

# What is this?❓

this is a repo that used to store my submission in dicoding.

the repo has 4 branch which the latest one is the `open_music_api_versi_3 branch`

# Restrictions!⚠️

for learn only! or you can read LICENSE.md, and <b>⚠️strictly not to use for submit submission in dicoding website with this repo.⚠️</b>

# step for run it
add .env file to your root project and provide information that need such as :
```
# server configuration
HOST=localhost
PORT=5000

# node-postgres configuration
PGUSER=
PGHOST=localhost
PGPASSWORD=
PGDATABASE=dicoding_open_music_api
PGPORT=5432

# JWT Token
ACCESS_TOKEN_KEY=
REFRESH_TOKEN_KEY=
ACCESS_TOKEN_AGE=1800

# Message broker
RABBITMQ_SERVER=amqp://localhost
```

## run locally

```bash
$ git clone https://github.com/krisna31/open_music_api.git
$ cd dicoding-open-music-api
$ npm install
$ npm run migrate up
$ npm run start-dev
```
