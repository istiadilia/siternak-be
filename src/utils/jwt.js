const jwt = require('jsonwebtoken');

// Access token is used to access protected routes.
// If it expires, the user must log in again.
// 1y is not ideal, but you need to change this value depending on your app logic.
function generateAccessToken(user) {
  return jwt.sign({ userId: user.userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '1y',
  });
}

// Refresh token will be created if the access token expires.
// But, in this code, refresh token is not implemented yet in the front end logic.
// You can change this value depending on your app logic.
function generateRefreshToken(user, jti) {
  return jwt.sign(
    {
      userId: user.userId,
      jti,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: '1y',
    },
  );
}

function generateTokens(user, jti) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, jti);

  return {
    accessToken,
    refreshToken,
  };
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
};
