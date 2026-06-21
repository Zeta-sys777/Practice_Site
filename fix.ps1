# -*- coding: utf-8 -*-
# Запуск: powershell -ExecutionPolicy Bypass -File fix.ps1
#
# Что делает этот скрипт:
# 1. Создаёт src/utils/translateKeys.js — словарь "кириллица -> английский"
#    для ключей, которые возвращаются в JSON.
# 2. Переписывает route-файлы так, чтобы перед res.json() ключи объекта
#    переводились на английский (translateKeys).
#
# Все .js файлы остаются ASCII-safe (только \uXXXX escape-последовательности),
# поэтому проблем с кодировкой при записи через WriteAllText не будет.
#
# Если у вас есть другие поля в таблицах "новости" / "редколлегия" /
# "научные_направления", которые тоже нужно перевести в английские ключи -
# пришлите их точные кириллические названия колонок, и я добавлю их в словарь
# (угадывать их я не стал, чтобы не сломать запросы неверными именами).

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Fixing files..." -ForegroundColor Cyan

# make sure directories exist
New-Item -ItemType Directory -Force -Path "$PWD\src\config"  | Out-Null
New-Item -ItemType Directory -Force -Path "$PWD\src\routes"  | Out-Null
New-Item -ItemType Directory -Force -Path "$PWD\src\utils"   | Out-Null

# index.js
$index = @'
require('dotenv').config()
const express = require('express')
const cors = require('cors')

const articlesRouter   = require('./src/routes/articles')
const directionsRouter = require('./src/routes/directions')
const searchRouter     = require('./src/routes/search')
const submitRouter     = require('./src/routes/submit')
const newsRouter       = require('./src/routes/news')
const editorialRouter  = require('./src/routes/editorial')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/articles',   articlesRouter)
app.use('/api/directions', directionsRouter)
app.use('/api/search',     searchRouter)
app.use('/api/submit',     submitRouter)
app.use('/api/news',       newsRouter)
app.use('/api/editorial',  editorialRouter)

app.get('/', (req, res) => {
  res.json({
    message: 'Server is running',
    endpoints: [
      'GET  /api/articles',
      'GET  /api/articles/:id',
      'GET  /api/directions',
      'GET  /api/directions/:slug',
      'GET  /api/search?q=text',
      'POST /api/submit',
      'GET  /api/news',
      'GET  /api/editorial',
    ]
  })
})

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Not found' })
})

app.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT)
})
'@
[System.IO.File]::WriteAllText("$PWD\index.js", $index, [System.Text.Encoding]::UTF8)

# src/config/supabase.js
$supabaseConfig = @'
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

module.exports = supabase
'@
[System.IO.File]::WriteAllText("$PWD\src\config\supabase.js", $supabaseConfig, [System.Text.Encoding]::UTF8)

# src/utils/translateKeys.js
$translateKeys = @'
// Cyrillic DB column names -> English JSON keys for API responses.
// Add more entries here if you need other fields translated too -
// unmapped keys are passed through unchanged.

const KEY_MAP = {
  '\u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435_\u0440\u0443\u0441': 'name_ru',
  '\u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435_\u043a\u0430\u0437': 'name_kz',
  '\u0430\u043d\u043d\u043e\u0442\u0430\u0446\u0438\u044f_\u0440\u0443\u0441': 'annotation_ru',
  '\u043a\u043b\u044e\u0447\u0435\u0432\u044b\u0435_\u0441\u043b\u043e\u0432\u0430': 'keywords',
  '\u0434\u0430\u0442\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438': 'pub_date',
  '\u043f\u0443\u0442\u044c_\u043a_pdf': 'pdf_url',
  '\u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u044b': 'views',
  '\u0441\u0442\u0430\u0442\u0443\u0441': 'status',
  '\u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435_id': 'direction_id',
  '\u043f\u043e\u0440\u044f\u0434\u043e\u043a_\u0441\u043e\u0440\u0442\u0438\u0440\u043e\u0432\u043a\u0438': 'sort_order',
  '\u043a\u043e\u0434_url': 'slug',
  '\u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435': 'title',
  '\u0430\u043d\u043d\u043e\u0442\u0430\u0446\u0438\u044f': 'annotation',
  '\u0438\u043c\u044f_\u0430\u0432\u0442\u043e\u0440\u0430': 'author_name',
  '\u0435\u043c\u0430\u0438\u043b_\u0430\u0432\u0442\u043e\u0440\u0430': 'author_email',
  '\u043c\u0435\u0441\u0442\u043e_\u0440\u0430\u0431\u043e\u0442\u044b_\u0430\u0432\u0442\u043e\u0440\u0430': 'author_workplace'
}

function translateKeys(input) {
  if (Array.isArray(input)) {
    return input.map(translateKeys)
  }
  if (input && typeof input === 'object') {
    const out = {}
    for (const key of Object.keys(input)) {
      const newKey = KEY_MAP[key] || key
      out[newKey] = translateKeys(input[key])
    }
    return out
  }
  return input
}

module.exports = { translateKeys, KEY_MAP }
'@
[System.IO.File]::WriteAllText("$PWD\src\utils\translateKeys.js", $translateKeys, [System.Text.Encoding]::UTF8)

# src/routes/articles.js
$articles = @'
const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')
const { translateKeys } = require('../utils/translateKeys')

// GET /api/articles
router.get('/', async (req, res) => {
  try {
    const { direction_id, year, page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit

    let query = supabase
      .from('\u0441\u0442\u0430\u0442\u044c\u0438')
      .select('id, \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435_\u0440\u0443\u0441, \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435_\u043a\u0430\u0437, \u0430\u043d\u043d\u043e\u0442\u0430\u0446\u0438\u044f_\u0440\u0443\u0441, \u043a\u043b\u044e\u0447\u0435\u0432\u044b\u0435_\u0441\u043b\u043e\u0432\u0430, \u0434\u0430\u0442\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438, \u043f\u0443\u0442\u044c_\u043a_pdf, \u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u044b')
      .eq('\u0441\u0442\u0430\u0442\u0443\u0441', '\u043e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043d\u0430')
      .order('\u0434\u0430\u0442\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438', { ascending: false })
      .range(offset, offset + Number(limit) - 1)

    if (direction_id) query = query.eq('\u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435_id', direction_id)
    if (year) {
      query = query
        .gte('\u0434\u0430\u0442\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438', year + '-01-01')
        .lte('\u0434\u0430\u0442\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438', year + '-12-31')
    }

    const { data, error } = await query
    if (error) throw error
    res.json({ success: true, data: translateKeys(data) })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/articles/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('\u0441\u0442\u0430\u0442\u044c\u0438')
      .select('*')
      .eq('id', id)
      .eq('\u0441\u0442\u0430\u0442\u0443\u0441', '\u043e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043d\u0430')
      .single()

    if (error) throw error
    if (!data) return res.status(404).json({ success: false, error: 'Not found' })

    const views = data['\u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u044b'] || 0
    await supabase
      .from('\u0441\u0442\u0430\u0442\u044c\u0438')
      .update({ '\u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u044b': views + 1 })
      .eq('id', id)

    res.json({ success: true, data: translateKeys(data) })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
'@
[System.IO.File]::WriteAllText("$PWD\src\routes\articles.js", $articles, [System.Text.Encoding]::UTF8)

# src/routes/directions.js
$directions = @'
const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')
const { translateKeys } = require('../utils/translateKeys')

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('\u043d\u0430\u0443\u0447\u043d\u044b\u0435_\u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f')
      .select('*')
      .order('\u043f\u043e\u0440\u044f\u0434\u043e\u043a_\u0441\u043e\u0440\u0442\u0438\u0440\u043e\u0432\u043a\u0438')
    if (error) throw error
    res.json({ success: true, data: translateKeys(data) })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.get('/:slug', async (req, res) => {
  try {
    const { data: direction, error } = await supabase
      .from('\u043d\u0430\u0443\u0447\u043d\u044b\u0435_\u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f')
      .select('*')
      .eq('\u043a\u043e\u0434_url', req.params.slug)
      .single()
    if (error) throw error
    if (!direction) return res.status(404).json({ success: false, error: 'Not found' })

    const { data: articles } = await supabase
      .from('\u0441\u0442\u0430\u0442\u044c\u0438')
      .select('id, \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435_\u0440\u0443\u0441, \u0430\u043d\u043d\u043e\u0442\u0430\u0446\u0438\u044f_\u0440\u0443\u0441, \u0434\u0430\u0442\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438, \u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u044b')
      .eq('\u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435_id', direction.id)
      .eq('\u0441\u0442\u0430\u0442\u0443\u0441', '\u043e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043d\u0430')
      .order('\u0434\u0430\u0442\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438', { ascending: false })

    const result = Object.assign({}, translateKeys(direction), { articles: translateKeys(articles) })
    res.json({ success: true, data: result })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
'@
[System.IO.File]::WriteAllText("$PWD\src\routes\directions.js", $directions, [System.Text.Encoding]::UTF8)

# src/routes/search.js
$search = @'
const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')
const { translateKeys } = require('../utils/translateKeys')

router.get('/', async (req, res) => {
  try {
    const { q, direction_id } = req.query
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Min 2 characters' })
    }
    const term = q.trim()

    let query = supabase
      .from('\u0441\u0442\u0430\u0442\u044c\u0438')
      .select('id, \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435_\u0440\u0443\u0441, \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435_\u043a\u0430\u0437, \u0430\u043d\u043d\u043e\u0442\u0430\u0446\u0438\u044f_\u0440\u0443\u0441, \u043a\u043b\u044e\u0447\u0435\u0432\u044b\u0435_\u0441\u043b\u043e\u0432\u0430, \u0434\u0430\u0442\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438, \u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u044b')
      .eq('\u0441\u0442\u0430\u0442\u0443\u0441', '\u043e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043d\u0430')
      .or('\u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435_\u0440\u0443\u0441.ilike.%' + term + '%,\u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435_\u043a\u0430\u0437.ilike.%' + term + '%,\u043a\u043b\u044e\u0447\u0435\u0432\u044b\u0435_\u0441\u043b\u043e\u0432\u0430.ilike.%' + term + '%')
      .order('\u0434\u0430\u0442\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438', { ascending: false })

    if (direction_id) query = query.eq('\u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435_id', direction_id)

    const { data, error } = await query
    if (error) throw error
    res.json({ success: true, count: data.length, data: translateKeys(data) })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
'@
[System.IO.File]::WriteAllText("$PWD\src\routes\search.js", $search, [System.Text.Encoding]::UTF8)

# src/routes/submit.js
$submit = @'
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

router.post('/', upload.single('pdf'), async (req, res) => {
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
      .from('\u0437\u0430\u044f\u0432\u043a\u0438_\u043d\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u044e')
      .insert([{
        '\u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435': title,
        '\u0430\u043d\u043d\u043e\u0442\u0430\u0446\u0438\u044f': annotation,
        '\u043a\u043b\u044e\u0447\u0435\u0432\u044b\u0435_\u0441\u043b\u043e\u0432\u0430': keywords || '',
        '\u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435_id': parseInt(direction_id),
        '\u0438\u043c\u044f_\u0430\u0432\u0442\u043e\u0440\u0430': author_name,
        '\u0435\u043c\u0430\u0438\u043b_\u0430\u0432\u0442\u043e\u0440\u0430': author_email,
        '\u043c\u0435\u0441\u0442\u043e_\u0440\u0430\u0431\u043e\u0442\u044b_\u0430\u0432\u0442\u043e\u0440\u0430': author_workplace || '',
        '\u043f\u0443\u0442\u044c_\u043a_pdf': pdfPath,
        '\u0441\u0442\u0430\u0442\u0443\u0441': '\u043d\u043e\u0432\u0430\u044f'
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
'@
[System.IO.File]::WriteAllText("$PWD\src\routes\submit.js", $submit, [System.Text.Encoding]::UTF8)

# src/routes/news.js
$news = @'
const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')
const { translateKeys } = require('../utils/translateKeys')

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit
    const { data, error } = await supabase
      .from('\u043d\u043e\u0432\u043e\u0441\u0442\u0438')
      .select('*')
      .order('\u0434\u0430\u0442\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438', { ascending: false })
      .range(offset, offset + Number(limit) - 1)
    if (error) throw error
    res.json({ success: true, data: translateKeys(data) })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('\u043d\u043e\u0432\u043e\u0441\u0442\u0438')
      .select('*')
      .eq('id', req.params.id)
      .single()
    if (error) throw error
    if (!data) return res.status(404).json({ success: false, error: 'Not found' })
    res.json({ success: true, data: translateKeys(data) })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
'@
[System.IO.File]::WriteAllText("$PWD\src\routes\news.js", $news, [System.Text.Encoding]::UTF8)

# src/routes/editorial.js
$editorial = @'
const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')
const { translateKeys } = require('../utils/translateKeys')

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('\u0440\u0435\u0434\u043a\u043e\u043b\u043b\u0435\u0433\u0438\u044f')
      .select('*')
      .order('\u043f\u043e\u0440\u044f\u0434\u043e\u043a_\u0441\u043e\u0440\u0442\u0438\u0440\u043e\u0432\u043a\u0438')
    if (error) throw error
    res.json({ success: true, data: translateKeys(data) })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
'@
[System.IO.File]::WriteAllText("$PWD\src\routes\editorial.js", $editorial, [System.Text.Encoding]::UTF8)

Write-Host "Done! All files fixed." -ForegroundColor Green
Write-Host "Now run: node index.js" -ForegroundColor Yellow