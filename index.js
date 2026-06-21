require('dotenv').config()
const express = require('express')
const cors = require('cors')

const articlesRouter   = require('./src/routes/articles')
const directionsRouter = require('./src/routes/directions')
const searchRouter     = require('./src/routes/search')
const submitRouter     = require('./src/routes/submit')
const newsRouter       = require('./src/routes/news')
const editorialRouter  = require('./src/routes/editorial')
const adminRouter      = require('./src/routes/admin')
const authRouter       = require('./src/routes/auth')
const profileRouter    = require('./src/routes/profile')
const authorsRouter    = require('./src/routes/authors')
const contactRouter    = require('./src/routes/contact')
const statsRouter      = require('./src/routes/stats')
const downloadRouter   = require('./src/routes/download')
const submissionsRouter = require('./src/routes/submissions')

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
app.use('/api/admin',      adminRouter)
app.use('/api',            authRouter)
app.use('/api',            profileRouter)
app.use('/api',            authorsRouter)
app.use('/api',            contactRouter)
app.use('/api',            statsRouter)
app.use('/api/download',   downloadRouter)
app.use('/api',            submissionsRouter)
app.get('/', (req, res) => {
  res.json({
    message: 'Server is running',
    public_endpoints: [
      'GET  /api/articles',
      'GET  /api/articles/:id',
      'GET  /api/directions',
      'GET  /api/directions/:slug',
      'GET  /api/search?q=text',
      'POST /api/submit',
      'GET  /api/news',
      'GET  /api/editorial',
    ],
    author_endpoints: [
      'GET  /api/submissions',
      'GET  /api/submissions/:id',
    ],
    admin_endpoints: [
      'GET    /api/admin/metrics',
      'GET    /api/admin/submissions',
      'GET    /api/admin/submissions/:id',
      'PATCH  /api/admin/submissions/:id',
      'POST   /api/admin/submissions/:id/publish',
      'DELETE /api/admin/submissions/:id',
      'GET    /api/admin/articles',
      'PATCH  /api/admin/articles/:id',
      'DELETE /api/admin/articles/:id',
      'POST   /api/admin/news',
      'DELETE /api/admin/news/:id',
    ]
  })
})

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Not found' })
})

app.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT)
})