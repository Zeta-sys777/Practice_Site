const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const supabase = require('../config/supabase')

// Настройка загрузки файлов
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Разрешены только PDF файлы'), false)
    }
  }
})

// Подача заявки на публикацию
router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    const {
      название,
      аннотация,
      ключевые_слова,
      направление_id,
      имя_автора,
      email_автора,
      место_работы_автора
    } = req.body

    // Проверка обязательных полей
    if (!название || !аннотация || !направление_id || !имя_автора || !email_автора) {
      return res.status(400).json({ success: false, error: 'Заполните все обязательные поля' })
    }

    let путь_к_pdf = ''

    // Загружаем PDF в Supabase Storage
    if (req.file) {
      const fileName = `${Date.now()}_${req.file.originalname.replace(/\s/g, '_')}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pdfs')
        .upload(fileName, req.file.buffer, { contentType: 'application/pdf' })

      if (uploadError) {
        console.error('Ошибка загрузки PDF:', uploadError)
      } else {
        путь_к_pdf = uploadData.path
      }
    }

    // Сохраняем заявку в БД
    const { data, error } = await supabase
      .from('заявки_на_публикацию')
      .insert([{
        название,
        аннотация,
        ключевые_слова: ключевые_слова || '',
        направление_id: parseInt(направление_id),
        имя_автора,
        email_автора,
        место_работы_автора: место_работы_автора || '',
        путь_к_pdf,
        статус: 'новая'
      }])
      .select()
      .single()

    if (error) throw error

    res.json({
      success: true,
      message: 'Заявка успешно отправлена! Мы свяжемся с вами в течение 5 рабочих дней.',
      data
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
