const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Токен не предоставлен' })
  }

  const token = authHeader.split(' ')[1]

  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Неверный или истёкший токен' })
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Доступ запрещён' })
    }
    next()
  }
}

module.exports = { verifyToken, requireRole }