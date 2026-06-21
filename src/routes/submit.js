const { verifyToken, requireRole } = require('../middleware/auth')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const supabase = require('../config/supabase')
const { translateKeys } = require('../utils/translateKeys')

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true)
    else cb(new Error('Only PDF allowed'), false)
  }
})

router.post('/', verifyToken, requireRole('автор', 'администратор'), async (req, res) => {
  try {
    const { title, annotation, keywords, direction_id, author_name, author_email, author_workplace } = req.body

    if (!title || !annotation || !direction_id || !author_name || !author_email) {
      return res.status(400).json({ success: false, error: 'Fill all required fields' })
    }

    let pdfPath = ''
    if (req.file) {
      const fileName = Date.now() + '_' + req.file.originalname.replace(/\s/g, '_')
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pdfs')
        .upload(fileName, req.file.buffer, { contentType: 'application/pdf' })
      if (!uploadError) pdfPath = uploadData.path
    }

    const { data, error } = await supabase
      .from('заявки_на_публикацию')
      .insert([{
        'название': title,
        'аннотация': annotation,
        'ключевые_слова': keywords || '',
        'направление_id': parseInt(direction_id),
        'имя_автора': author_name,
        'email_автора': author_email,
        'место_работы_автора': author_workplace || '',
        'путь_к_pdf': pdfPath,
        'статус': 'новая'
      }])
      .select()
      .single()

    if (error) throw error
    res.json({ success: true, message: 'Application submitted!', data: translateKeys(data) })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
