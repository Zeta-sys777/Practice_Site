const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')
const { translateKeys } = require('../utils/translateKeys')

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('\u0440\u0435\u0434\u043a\u043e\u043b\u043b\u0435\u0433\u0438\u044f')
      .select('*')
      .order('\u043f\u043e\u0440\u044f\u0434\u043e\u043a_\u0441\u043e\u0440\u0442\u0438\u0440\u043e\u0432\u043a\u0438')
    if (error) throw error
    res.json({ success: true, data: translateKeys(data) })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router