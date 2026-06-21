const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')
const { translateKeys } = require('../utils/translateKeys')

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('\u043d\u0430\u0443\u0447\u043d\u044b\u0435_\u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f')
      .select('*')
      .order('\u043f\u043e\u0440\u044f\u0434\u043e\u043a_\u0441\u043e\u0440\u0442\u0438\u0440\u043e\u0432\u043a\u0438')
    if (error) throw error
    res.json({ success: true, data: translateKeys(data) })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.get('/:slug', async (req, res) => {
  try {
    const { data: direction, error } = await supabase
      .from('\u043d\u0430\u0443\u0447\u043d\u044b\u0435_\u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f')
      .select('*')
      .eq('\u043a\u043e\u0434_url', req.params.slug)
      .single()
    if (error) throw error
    if (!direction) return res.status(404).json({ success: false, error: 'Not found' })

    const { data: articles } = await supabase
      .from('\u0441\u0442\u0430\u0442\u044c\u0438')
      .select('id, \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435_\u0440\u0443\u0441, \u0430\u043d\u043d\u043e\u0442\u0430\u0446\u0438\u044f_\u0440\u0443\u0441, \u0434\u0430\u0442\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438, \u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u044b')
      .eq('\u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435_id', direction.id)
      .eq('\u0441\u0442\u0430\u0442\u0443\u0441', '\u043e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043d\u0430')
      .order('\u0434\u0430\u0442\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438', { ascending: false })

   const result = Object.assign({}, translateKeys(direction), {
  articles: translateKeys(articles),
  articles_count: articles ? articles.length : 0
})
    res.json({ success: true, data: result })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router