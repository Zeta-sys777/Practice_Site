const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')

// Все научные направления
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('научные_направления')
      .select('*')
      .order('порядок_сортировки')

    if (error) throw error
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// Одно направление + его статьи
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params

    const { data: direction, error } = await supabase
      .from('научные_направления')
      .select('*')
      .eq('код_url', slug)
      .single()

    if (error) throw error
    if (!direction) return res.status(404).json({ success: false, error: 'Направление не найдено' })

    const { data: articles } = await supabase
      .from('статьи')
      .select('id, название_рус, название_каз, аннотация_рус, дата_публикации, просмотры')
      .eq('направление_id', direction.id)
      .eq('статус', 'опубликована')
      .order('дата_публикации', { ascending: false })

    res.json({ success: true, data: { ...direction, статьи: articles } })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
