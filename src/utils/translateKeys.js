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