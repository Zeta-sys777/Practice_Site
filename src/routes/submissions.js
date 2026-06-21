const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')
const { verifyToken } = require('../middleware/auth')
const { translateKeys } = require('../utils/translateKeys')

// GET /api/submissions — список своих заявок
router.get('/submissions', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('заявки_на_публикацию')
      .select('*')
      .eq('email_автора', req.user.email)
      .order('дата_отправки', { ascending: false })

    if (error) throw error

    res.json({ success: true, data: translateKeys(data) })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/submissions/:id — детали одной своей заявки
router.get('/submissions/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('заявки_на_публикацию')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ success: false, error: 'Заявка не найдена' })
      }
      throw error
    }

    if (data['email_автора'] !== req.user.email) {
      return res.status(403).json({ success: false, error: 'Нет доступа к этой заявке' })
    }

    res.json({ success: true, data: translateKeys(data) })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router