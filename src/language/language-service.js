const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first();
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id });
  },

  getHeadWord(db, head_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ id: head_id })
      .first();
  },

  updateLanguage(db, user_id, head_id, score) {
    return db('language')
      .where('user_id', user_id)
      .update({ head: head_id, total_score: score });
  },

  updateWord(db, word_id, next_id, counts) {
    return db('word')
      .where({ id: word_id })
      .update({ next: next_id, ...counts });
  }
};

module.exports = LanguageService;
