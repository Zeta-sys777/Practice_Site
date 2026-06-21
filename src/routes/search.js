const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')
const { translateKeys } = require('../utils/translateKeys')

router.get('/', async (req, res) => {
  try {
    const { q, direction_id } = req.query
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Min 2 characters' })
    }
    const term = q.trim()

    let query = supabase
      .from('\u0441\u0442\u0430\u0442\u044c\u0438')
      .select('id, \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435_\u0440\u0443\u0441, \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435_\u043a\u0430\u0437, \u0430\u043d\u043d\u043e\u0442\u0430\u0446\u0438\u044f_\u0440\u0443\u0441, \u043a\u043b\u044e\u0447\u0435\u0432\u044b\u0435_\u0441\u043b\u043e\u0432\u0430, \u0434\u0430\u0442\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438, \u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u044b')
      .eq('\u0441\u0442\u0430\u0442\u0443\u0441', '\u043e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043d\u0430')
      .or('\u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435_\u0440\u0443\u0441.ilike.%' + term + '%,\u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435_\u043a\u0430\u0437.ilike.%' + term + '%,\u043a\u043b\u044e\u0447\u0435\u0432\u044b\u0435_\u0441\u043b\u043e\u0432\u0430.ilike.%' + term + '%')
      .order('\u0434\u0430\u0442\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438', { ascending: false })

    if (direction_id) query = query.eq('\u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435_id', direction_id)

    const { data, error } = await query
    if (error) throw error
    res.json({ success: true, count: data.length, data: translateKeys(data) })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router