const Jwt = require("@hapi/jwt");
const InvariantError = require("../exceptions/InvariantError");
const config = require("../utils/config");

const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, config.app.accessTokenKey),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, config.app.refreshTokenKey),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, config.app.refreshTokenKey);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError("Refresh token tidak valid");
    }
  },
};

module.exports = TokenManager;
