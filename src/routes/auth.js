const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET;

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { email, password, полное_имя, role } = req.body;

    if (!email || !password || !полное_имя) {
      return res.status(400).json({ success: false, error: 'email, password и полное_имя обязательны' });
    }

    // Проверяем, есть ли уже такой пользователь
    const { data: existing } = await supabase
      .from('пользователи')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ success: false, error: 'Пользователь с таким email уже существует' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('пользователи')
      .insert({
        email,
        хэш_пароля: password_hash,
        роль: role || 'пользователь',
        полное_имя
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ success: false, error: 'Ошибка при создании пользователя: ' + error.message });
    }

    res.json({ success: true, data: { id: data.id, email: data.email, роль: data.роль } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Вход
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from('пользователи')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (!user) {
      return res.status(401).json({ success: false, error: 'Неверный email или пароль' });
    }

    const valid = await bcrypt.compare(password, user.хэш_пароля);
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Неверный email или пароль' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.роль },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ success: true, data: { token, role: user.роль } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;