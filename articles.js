const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')

// Все опубликованные статьи (с фильтрами)
router.get('/', async (req, res) => {
  try {
    const { direction_id, year, page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit

    let query = supabase
      .from('статьи')
      .select(`
        id, название_рус, название_каз, аннотация_рус, аннотация_каз,
        ключевые_слова, дата_публикации, путь_к_pdf, просмотры,
        научные_направления ( id, название_рус, название_каз, код_url ),
        авторы_статей ( авторы ( id, полное_имя, место_работы ) )
      `)
      .eq('статус', 'опубликована')
      .order('дата_публикации', { ascending: false })
      .range(offset, offset + limit - 1)

    if (direction_id) query = query.eq('направление_id', direction_id)
    if (year) query = query.gte('дата_публикации', `${year}-01-01`).lte('дата_публикации', `${year}-12-31`)

    const { data, error } = await query
    if (error) throw error

    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// Одна статья по ID + увеличиваем счётчик просмотров
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('статьи')
      .select(`
        *,
        научные_направления ( id, название_рус, название_каз, код_url ),
        авторы_статей ( авторы ( id, полное_имя, место_работы, научные_интересы, email ) )
      `)
      .eq('id', id)
      .eq('статус', 'опубликована')
      .single()

    if (error) throw error
    if (!data) return res.status(404).json({ success: false, error: 'Статья не найдена' })

    // Увеличиваем просмотры
    await supabase
      .from('статьи')
      .update({ просмотры: data.просмотры + 1 })
      .eq('id', id)

    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
