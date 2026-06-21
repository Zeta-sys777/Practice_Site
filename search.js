const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')

// Поиск по названию, автору, ключевым словам
router.get('/', async (req, res) => {
  try {
    const { q, direction_id } = req.query

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Введите минимум 2 символа' })
    }

    const term = q.trim().toLowerCase()

    let query = supabase
      .from('статьи')
      .select(`
        id, название_рус, название_каз, аннотация_рус, ключевые_слова,
        дата_публикации, просмотры,
        научные_направления ( id, название_рус, код_url ),
        авторы_статей ( авторы ( полное_имя ) )
      `)
      .eq('статус', 'опубликована')
      .or(`название_рус.ilike.%${term}%,название_каз.ilike.%${term}%,ключевые_слова.ilike.%${term}%,аннотация_рус.ilike.%${term}%`)
      .order('дата_публикации', { ascending: false })

    if (direction_id) query = query.eq('направление_id', direction_id)

    const { data, error } = await query
    if (error) throw error

    res.json({ success: true, count: data.length, data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
