const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')

// GET /api/authors — публичный список авторов
router.get('/authors', async (req, res) => {
  const { data, error } = await supabase
    .from('авторы')
    .select('id, полное_имя, место_работы, научные_интересы, email')

  if (error) return res.status(500).json({ success: false, error: error.message })

  res.status(200).json({ success: true, data })
})

module.exports = router