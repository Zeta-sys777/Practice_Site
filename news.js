const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')

// Все новости
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit

    const { data, error } = await supabase
      .from('новости')
      .select('*')
      .order('дата_публикации', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// Одна новость
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('новости')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error) throw error
    if (!data) return res.status(404).json({ success: false, error: 'Новость не найдена' })

    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
