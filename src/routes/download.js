const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')

// GET /api/download/:id/pdf
router.get('/:id/pdf', async (req, res) => {
  const { id } = req.params
  const { data, error } = await supabase
    .from('статьи')
    .select('путь_к_pdf')
    .eq('id', id)
    .single()

  if (error || !data || !data['путь_к_pdf']) {
    return res.status(404).json({ error: 'Файл не найден' })
  }

  res.redirect(data['путь_к_pdf'])
})

module.exports = router