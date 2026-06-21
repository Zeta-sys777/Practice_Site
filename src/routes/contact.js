const express = require('express')
const router = express.Router()

// POST /api/contact
// TODO: реализовать отправку письма (nodemailer / Gmail App Password)
router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Заполните все поля' })
  }

  res.json({ success: true, message: 'Сообщение отправлено' })
})

module.exports = router