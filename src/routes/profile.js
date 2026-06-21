const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')
const { verifyToken, requireRole } = require('../middleware/auth')

// GET /api/profile — получить свой профиль
router.get('/profile', verifyToken, requireRole('автор', 'администратор'), async (req, res) => {
  const userId = req.user.id

  const { data, error } = await supabase
    .from('авторы')
    .select('*')
    .eq('пользователь_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = "row not found" — не ошибка, просто профиль ещё не создан
    return res.status(500).json({ success: false, error: error.message })
  }

  if (!data) {
    return res.status(200).json({ success: true, profile: null, message: 'Профиль ещё не заполнен' })
  }

  res.status(200).json({ success: true, profile: data })
})

// PUT /api/profile — обновить свой профиль (или создать, если не существует)
router.put('/profile', verifyToken, requireRole('автор', 'администратор'), async (req, res) => {
  const userId = req.user.id
  const { полное_имя, место_работы, научные_интересы, email } = req.body

  // Проверяем, есть ли уже запись
  const { data: existing } = await supabase
    .from('авторы')
    .select('id')
    .eq('пользователь_id', userId)
    .single()

  let result

  if (existing) {
    // Обновляем
    result = await supabase
      .from('авторы')
      .update({ полное_имя, место_работы, научные_интересы, email })
      .eq('пользователь_id', userId)
      .select()
      .single()
  } else {
    // Создаём
    result = await supabase
      .from('авторы')
      .insert({ пользователь_id: userId, полное_имя, место_работы, научные_интересы, email })
      .select()
      .single()
  }

  if (result.error) {
    return res.status(500).json({ success: false, error: result.error.message })
  }

  res.status(200).json({ success: true, profile: result.data })
})

module.exports = router