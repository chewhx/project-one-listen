require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwksRsa = require("jwks-rsa");
const { AUTH0_DOMAIN: DOMAIN, AUTH0_AUDIENCE: AUDIENCE } = process.env;

const client = jwksRsa({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: `https://${DOMAIN}/.well-known/jwks.json`,
});

const authorised = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      const token = req.headers.authorization.split(" ")[1];
      const kid = "cqNgw5NulaqnPBReUnWVy";
      const key = await client.getSigningKey(kid);
      const secret = key.getPublicKey();
      const decoded = await jwt.verify(token, secret, {
        audience: AUDIENCE,
        issuer: `https://${DOMAIN}/`,
        algorithms: ["RS256"],
      });
      if (decoded) {
        req.user = decoded;
        next();
      }
    }
  } catch (e) {
    throw Error(e.message);
  }
};

module.exports = authorised;
