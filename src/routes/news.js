const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')
const { translateKeys } = require('../utils/translateKeys')

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit
    const { data, error } = await supabase
      .from('\u043d\u043e\u0432\u043e\u0441\u0442\u0438')
      .select('*')
      .order('\u0434\u0430\u0442\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438', { ascending: false })
      .range(offset, offset + Number(limit) - 1)
    if (error) throw error
    res.json({ success: true, data: translateKeys(data) })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('\u043d\u043e\u0432\u043e\u0441\u0442\u0438')
      .select('*')
      .eq('id', req.params.id)
      .single()
    if (error) throw error
    if (!data) return res.status(404).json({ success: false, error: 'Not found' })
    res.json({ success: true, data: translateKeys(data) })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router