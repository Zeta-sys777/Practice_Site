const express = require('express')
const router = express.Router()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

// GET /api/stats
router.get('/stats', async (req, res) => {
  try {
    const [articles, directions, authors] = await Promise.all([
      supabase.from('статьи').select('*', { count: 'exact', head: true }),
      supabase.from('научные_направления').select('*', { count: 'exact', head: true }),
      supabase.from('авторы').select('*', { count: 'exact', head: true }),
    ])

    res.json({
      publications: articles.count,
      directions: directions.count,
      authors: authors.count,
      issue: 3  // пока фиксированное число, потом можно вынести в БД
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

module.exports = router