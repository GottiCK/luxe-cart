import jwt from 'jsonwebtoken';

// Signs a JWT and sets it as an httpOnly cookie on the response. The
// frontend never touches the token directly — this protects it from being
// read or stolen via XSS, unlike storing it in localStorage.
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });

  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: isProduction, // required for sameSite: 'none' — cookie only sent over HTTPS
    // 'lax' works for localhost where frontend/backend share an origin.
    // 'none' is required once they're on two different deployed domains
    // (e.g. a Vercel frontend calling a Render backend) — otherwise the
    // browser silently drops the cookie and login breaks in production.
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};

export default generateToken;