# Запусти этот скрипт в папке C:\практика\journal-backend
# Команда: powershell -ExecutionPolicy Bypass -File setup.ps1

Write-Host "Создаём структуру проекта..." -ForegroundColor Cyan

# Создаём папки
New-Item -ItemType Directory -Force -Path "src\config"  | Out-Null
New-Item -ItemType Directory -Force -Path "src\routes"  | Out-Null

Write-Host "Папки созданы" -ForegroundColor Green

# .env
@'
SUPABASE_URL=https://uscjgsxxclyvqkxdxykr.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2pnc3h4Y2x5dnFreGR4eWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MzUwODIsImV4cCI6MjA5NzAxMTA4Mn0.kiQaEDICHTycnmQS1TTf6QqAatyT6wi_fkK7-EiJT8Y
PORT=3000
'@ | Set-Content -Encoding UTF8 ".env"

# index.js
@'
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
    message: 'Сервер научного журнала работает',
    version: '1.0.0',
    endpoints: [
      'GET  /api/articles          - все статьи',
      'GET  /api/articles/:id      - одна статья',
      'GET  /api/directions        - все направления',
      'GET  /api/directions/:slug  - направление + статьи',
      'GET  /api/search?q=текст    - поиск',
      'POST /api/submit            - подать заявку',
      'GET  /api/news              - новости',
      'GET  /api/editorial         - редколлегия',
    ]
  })
})

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Маршрут не найден' })
})

app.listen(PORT, () => {
  console.log('Сервер запущен на http://localhost:' + PORT)
})
'@ | Set-Content -Encoding UTF8 "index.js"

# src/config/supabase.js
@'
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

module.exports = supabase
'@ | Set-Content -Encoding UTF8 "src\config\supabase.js"

# src/routes/articles.js
@'
const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')

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
    if (year) query = query.gte('дата_публикации', year + '-01-01').lte('дата_публикации', year + '-12-31')

    const { data, error } = await query
    if (error) throw error
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

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

    await supabase.from('статьи').update({ просмотры: data.просмотры + 1 }).eq('id', id)
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
'@ | Set-Content -Encoding UTF8 "src\routes\articles.js"

# src/routes/directions.js
@'
const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('научные_направления')
      .select('*')
      .order('порядок_сортировки')
    if (error) throw error
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.get('/:slug', async (req, res) => {
  try {
    const { data: direction, error } = await supabase
      .from('научные_направления')
      .select('*')
      .eq('код_url', req.params.slug)
      .single()
    if (error) throw error
    if (!direction) return res.status(404).json({ success: false, error: 'Направление не найдено' })

    const { data: articles } = await supabase
      .from('статьи')
      .select('id, название_рус, название_каз, аннотация_рус, дата_публикации, просмотры')
      .eq('направление_id', direction.id)
      .eq('статус', 'опубликована')
      .order('дата_публикации', { ascending: false })

    res.json({ success: true, data: { ...direction, статьи: articles } })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
'@ | Set-Content -Encoding UTF8 "src\routes\directions.js"

# src/routes/search.js
@'
const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')

router.get('/', async (req, res) => {
  try {
    const { q, direction_id } = req.query
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Введите минимум 2 символа' })
    }
    const term = q.trim()

    let query = supabase
      .from('статьи')
      .select(`
        id, название_рус, название_каз, аннотация_рус, ключевые_слова,
        дата_публикации, просмотры,
        научные_направления ( id, название_рус, код_url ),
        авторы_статей ( авторы ( полное_имя ) )
      `)
      .eq('статус', 'опубликована')
      .or('название_рус.ilike.%' + term + '%,название_каз.ilike.%' + term + '%,ключевые_слова.ilike.%' + term + '%')
      .order('дата_публикации', { ascending: false })

    if (direction_id) query = query.eq('направление_id', direction_id)

    const { data, error } = await query
    if (error) throw error
    res.json({ success: true, count: data.length, data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
'@ | Set-Content -Encoding UTF8 "src\routes\search.js"

# src/routes/submit.js
@'
const express = require('express')
const router = express.Router()
const multer = require('multer')
const supabase = require('../config/supabase')

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true)
    else cb(new Error('Разрешены только PDF файлы'), false)
  }
})

router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    const { название, аннотация, ключевые_слова, направление_id, имя_автора, email_автора, место_работы_автора } = req.body

    if (!название || !аннотация || !направление_id || !имя_автора || !email_автора) {
      return res.status(400).json({ success: false, error: 'Заполните все обязательные поля' })
    }

    let путь_к_pdf = ''
    if (req.file) {
      const fileName = Date.now() + '_' + req.file.originalname.replace(/\s/g, '_')
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pdfs')
        .upload(fileName, req.file.buffer, { contentType: 'application/pdf' })
      if (!uploadError) путь_к_pdf = uploadData.path
    }

    const { data, error } = await supabase
      .from('заявки_на_публикацию')
      .insert([{ название, аннотация, ключевые_слова: ключевые_слова || '', направление_id: parseInt(направление_id), имя_автора, email_автора, место_работы_автора: место_работы_автора || '', путь_к_pdf, статус: 'новая' }])
      .select().single()

    if (error) throw error
    res.json({ success: true, message: 'Заявка успешно отправлена!', data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
'@ | Set-Content -Encoding UTF8 "src\routes\submit.js"

# src/routes/news.js
@'
const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit
    const { data, error } = await supabase.from('новости').select('*').order('дата_публикации', { ascending: false }).range(offset, offset + limit - 1)
    if (error) throw error
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('новости').select('*').eq('id', req.params.id).single()
    if (error) throw error
    if (!data) return res.status(404).json({ success: false, error: 'Новость не найдена' })
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
'@ | Set-Content -Encoding UTF8 "src\routes\news.js"

# src/routes/editorial.js
@'
const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('редколлегия').select('*').order('порядок_сортировки')
    if (error) throw error
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
'@ | Set-Content -Encoding UTF8 "src\routes\editorial.js"

Write-Host ""
Write-Host "Готово! Все файлы созданы." -ForegroundColor Green
Write-Host ""
Write-Host "Запусти сервер командой:" -ForegroundColor Yellow
Write-Host "  node index.js" -ForegroundColor White
Write-Host ""
Write-Host "Затем открой браузер: http://localhost:3000" -ForegroundColor Yellow
