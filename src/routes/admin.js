const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { translateKeys } = require('../utils/translateKeys');
const { verifyToken, requireRole } = require('../middleware/auth');

// Все админ-роуты защищены JWT и ролью 'администратор'
router.use(verifyToken);
router.use(requireRole('администратор'));

// ---- SUBMISSIONS ----

// GET /api/admin/submissions
router.get('/submissions', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let query = supabase
      .from('\u0437\u0430\u044f\u0432\u043a\u0438_\u043d\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u044e')
      .select('*')
      .order('\u0434\u0430\u0442\u0430_\u043e\u0442\u043f\u0440\u0430\u0432\u043a\u0438', { ascending: false })
      .range(offset, offset + Number(limit) - 1);
    if (status) query = query.eq('\u0441\u0442\u0430\u0442\u0443\u0441', status);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data: translateKeys(data) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/submissions/:id
router.get('/submissions/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('\u0437\u0430\u044f\u0432\u043a\u0438_\u043d\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u044e')
      .select('*')
      .eq('id', req.params.id)
      .single();
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ success: false, error: 'Заявка не найдена' });
      }
      throw error;
    }
    res.json({ success: true, data: translateKeys(data) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/admin/submissions/:id
router.patch('/submissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['\u043f\u0440\u0438\u043d\u044f\u0442\u0430', '\u043e\u0442\u043a\u043b\u043e\u043d\u0435\u043d\u0430'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Status must be: принята or отклонена' });
    }
    const { data, error } = await supabase
      .from('\u0437\u0430\u044f\u0432\u043a\u0438_\u043d\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u044e')
      .update({ '\u0441\u0442\u0430\u0442\u0443\u0441': status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, data: translateKeys(data) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/submissions/:id/publish
router.post('/submissions/:id/publish', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: sub, error: subErr } = await supabase
      .from('\u0437\u0430\u044f\u0432\u043a\u0438_\u043d\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u044e')
      .select('*').eq('id', id).single();
    if (subErr) throw subErr;
    if (!sub) return res.status(404).json({ success: false, error: 'Not found' });

    const { data: article, error: artErr } = await supabase
      .from('\u0441\u0442\u0430\u0442\u044c\u0438')
      .insert([{
        '\u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435_\u0440\u0443\u0441':    sub['\u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435'],
        '\u0430\u043d\u043d\u043e\u0442\u0430\u0446\u0438\u044f_\u0440\u0443\u0441': sub['\u0430\u043d\u043d\u043e\u0442\u0430\u0446\u0438\u044f'],
        '\u043a\u043b\u044e\u0447\u0435\u0432\u044b\u0435_\u0441\u043b\u043e\u0432\u0430': sub['\u043a\u043b\u044e\u0447\u0435\u0432\u044b\u0435_\u0441\u043b\u043e\u0432\u0430'],
        '\u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435_id':  sub['\u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435_id'],
        '\u043f\u0443\u0442\u044c_\u043a_pdf':       sub['\u043f\u0443\u0442\u044c_\u043a_pdf'],
        '\u0441\u0442\u0430\u0442\u0443\u0441':             '\u043e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043d\u0430',
        '\u0434\u0430\u0442\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438': new Date().toISOString().split('T')[0],
        '\u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u044b': 0
      }])
      .select().single();
    if (artErr) throw artErr;

    await supabase
      .from('\u0437\u0430\u044f\u0432\u043a\u0438_\u043d\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u044e')
      .update({ '\u0441\u0442\u0430\u0442\u0443\u0441': '\u043f\u0440\u0438\u043d\u044f\u0442\u0430' })
      .eq('id', id);

    res.json({ success: true, message: 'Article published!', article_id: article.id, data: translateKeys(article) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/admin/submissions/:id
router.delete('/submissions/:id', async (req, res) => {
  try {
    const { data: existing, error: findError } = await supabase
      .from('\u0437\u0430\u044f\u0432\u043a\u0438_\u043d\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u044e')
      .select('id')
      .eq('id', req.params.id)
      .single();
    if (findError || !existing) {
      return res.status(404).json({ success: false, error: 'Заявка не найдена' });
    }
    const { error } = await supabase
      .from('\u0437\u0430\u044f\u0432\u043a\u0438_\u043d\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u044e')
      .delete()
      .eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Заявка удалена' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---- ARTICLES ----

// GET /api/admin/articles
router.get('/articles', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let query = supabase
      .from('\u0441\u0442\u0430\u0442\u044c\u0438')
      .select('*')
      .order('\u0434\u0430\u0442\u0430_\u0441\u043e\u0437\u0434\u0430\u043d\u0438\u044f', { ascending: false })
      .range(offset, offset + Number(limit) - 1);
    if (status) query = query.eq('\u0441\u0442\u0430\u0442\u0443\u0441', status);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data: translateKeys(data) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/admin/articles/:id
router.patch('/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fieldMap = {
      title_ru:     '\u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435_\u0440\u0443\u0441',
      title_kz:     '\u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435_\u043a\u0430\u0437',
      abstract_ru:  '\u0430\u043d\u043d\u043e\u0442\u0430\u0446\u0438\u044f_\u0440\u0443\u0441',
      abstract_kz:  '\u0430\u043d\u043d\u043e\u0442\u0430\u0446\u0438\u044f_\u043a\u0430\u0437',
      keywords:     '\u043a\u043b\u044e\u0447\u0435\u0432\u044b\u0435_\u0441\u043b\u043e\u0432\u0430',
      status:       '\u0441\u0442\u0430\u0442\u0443\u0441',
      published_at: '\u0434\u0430\u0442\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438'
    };
    const updates = {};
    for (const [eng, cyr] of Object.entries(fieldMap)) {
      if (req.body[eng] !== undefined) updates[cyr] = req.body[eng];
    }
    if (!Object.keys(updates).length) {
      return res.status(400).json({ success: false, error: 'No valid fields to update' });
    }
    const { data, error } = await supabase
      .from('\u0441\u0442\u0430\u0442\u044c\u0438')
      .update(updates).eq('id', id).select().single();
    if (error) throw error;
    res.json({ success: true, data: translateKeys(data) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/admin/articles/:id
router.delete('/articles/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('\u0441\u0442\u0430\u0442\u044c\u0438').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---- NEWS ----

// POST /api/admin/news
router.post('/news', async (req, res) => {
  try {
    const { title_ru, title_kz, content_ru, content_kz, image } = req.body;
    if (!title_ru || !content_ru) {
      return res.status(400).json({ success: false, error: 'title_ru and content_ru are required' });
    }
    const { data, error } = await supabase
      .from('\u043d\u043e\u0432\u043e\u0441\u0442\u0438')
      .insert([{
        '\u0437\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a_\u0440\u0443\u0441': title_ru,
        '\u0437\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a_\u043a\u0430\u0437': title_kz || '',
        '\u0442\u0435\u043a\u0441\u0442_\u0440\u0443\u0441':    content_ru,
        '\u0442\u0435\u043a\u0441\u0442_\u043a\u0430\u0437':    content_kz || '',
        '\u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435': image || ''
      }])
      .select().single();
    if (error) throw error;
    res.json({ success: true, data: translateKeys(data) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/admin/news/:id
router.delete('/news/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('\u043d\u043e\u0432\u043e\u0441\u0442\u0438').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'News deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---- METRICS ----

// GET /api/admin/metrics
router.get('/metrics', async (req, res) => {
  try {
    const [articles, submissions, news, directions] = await Promise.all([
      supabase.from('\u0441\u0442\u0430\u0442\u044c\u0438').select('id, \u0441\u0442\u0430\u0442\u0443\u0441, \u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u044b'),
      supabase.from('\u0437\u0430\u044f\u0432\u043a\u0438_\u043d\u0430_\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u044e').select('id, \u0441\u0442\u0430\u0442\u0443\u0441'),
      supabase.from('\u043d\u043e\u0432\u043e\u0441\u0442\u0438').select('id'),
      supabase.from('\u043d\u0430\u0443\u0447\u043d\u044b\u0435_\u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f').select('id')
    ]);
    const arts = articles.data || [];
    const subs = submissions.data || [];
    const totalViews = arts.reduce((sum, a) => sum + (a['\u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u044b'] || 0), 0);
    res.json({
      success: true,
      data: {
        articles: {
          total:       arts.length,
          published:   arts.filter(a => a['\u0441\u0442\u0430\u0442\u0443\u0441'] === '\u043e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043d\u0430').length,
          pending:     arts.filter(a => a['\u0441\u0442\u0430\u0442\u0443\u0441'] === '\u043d\u0430 \u0440\u0430\u0441\u0441\u043c\u043e\u0442\u0440\u0435\u043d\u0438\u0438').length,
          rejected:    arts.filter(a => a['\u0441\u0442\u0430\u0442\u0443\u0441'] === '\u043e\u0442\u043a\u043b\u043e\u043d\u0435\u043d\u0430').length,
          total_views: totalViews
        },
        submissions: {
          total:    subs.length,
          new:      subs.filter(s => s['\u0441\u0442\u0430\u0442\u0443\u0441'] === '\u043d\u043e\u0432\u0430\u044f').length,
          accepted: subs.filter(s => s['\u0441\u0442\u0430\u0442\u0443\u0441'] === '\u043f\u0440\u0438\u043d\u044f\u0442\u0430').length,
          rejected: subs.filter(s => s['\u0441\u0442\u0430\u0442\u0443\u0441'] === '\u043e\u0442\u043a\u043b\u043e\u043d\u0435\u043d\u0430').length
        },
        news:       { total: (news.data || []).length },
        directions: { total: (directions.data || []).length }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;