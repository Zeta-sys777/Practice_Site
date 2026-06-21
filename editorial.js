const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')

// Состав редакционной коллегии
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('редколлегия')
      .select('*')
      .order('порядок_сортировки')

    if (error) throw error
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
