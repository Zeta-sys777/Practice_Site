const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')
const { translateKeys } = require('../utils/translateKeys')

// GET /api/articles
router.get('/', async (req, res) => {
  try {
    const { direction_id, year, page = 1, limit = 10, sort } = req.query
    const offset = (page - 1) * limit

    let query = supabase
      .from('\u0441\u0442\u0430\u0442\u044c\u0438')
      .select('id, \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435_\u0440\u0443\u0441, \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435_\u043a\u0430\u0437, \u0430\u043d\u043d\u043e\u0442\u0430\u0446\u0438\u044f_\u0440\u0443\u0441, \u043a\u043b\u044e\u0447\u0435\u0432\u044b\u0435_\u0441\u043b\u043e\u0432\u0430, \u0434\u0430\u0442\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438, \u043f\u0443\u0442\u044c_\u043a_pdf, \u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u044b')
      .eq('\u0441\u0442\u0430\u0442\u0443\u0441', '\u043e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043d\u0430')
      .order(sort === 'views' ? 'просмотры' : 'дата_публикации', { ascending: false })
      .range(offset, offset + Number(limit) - 1)

    if (direction_id) query = query.eq('\u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435_id', direction_id)
    if (year) {
      query = query
        .gte('\u0434\u0430\u0442\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438', year + '-01-01')
        .lte('\u0434\u0430\u0442\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438', year + '-12-31')
    }

    const { data, error } = await query
    if (error) throw error
    res.json({ success: true, data: translateKeys(data) })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/articles/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('\u0441\u0442\u0430\u0442\u044c\u0438')
      .select('*')
      .eq('id', id)
      .eq('\u0441\u0442\u0430\u0442\u0443\u0441', '\u043e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043d\u0430')
      .single()

    if (error) throw error
    if (!data) return res.status(404).json({ success: false, error: 'Not found' })

    const views = data['\u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u044b'] || 0
    await supabase
      .from('\u0441\u0442\u0430\u0442\u044c\u0438')
      .update({ '\u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u044b': views + 1 })
      .eq('id', id)

    res.json({ success: true, data: translateKeys(data) })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router