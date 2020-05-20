const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');
const LinkedList = require('./linked-list');

const languageRouter = express.Router();
const jsonBodyParser = express.json();

languageRouter.use(requireAuth).use(async (req, res, next) => {
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get('db'),
      req.user.id
    );

    if (!language)
      return res.status(404).json({
        error: 'You don\'t have any languages',
      });

    req.language = language;
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/', async (req, res, next) => {
  try {
    const words = await LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id
    );

    return res.json({
      language: req.language,
      words,
    });
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/head', async (req, res, next) => {
  try {
    const headWord = await LanguageService.getHeadWord(
      req.app.get('db'),
      req.language.head
    );

    const data = {
      nextWord: headWord.original,
      totalScore: req.language.total_score,
      wordCorrectCount: headWord.correct_count,
      wordIncorrectCount: headWord.incorrect_count,
    };

    return res.json(data);
  } catch (error) {
    next(error);
  }
});

// may the mess begin
languageRouter.post('/guess', jsonBodyParser, async (req, res, next) => {
  try {
    const { guess } = req.body;
    const db = req.app.get('db');
    if (!guess) {
      return res.status(400).json({
        error: 'Missing \'guess\' in request body',
      });
    }

    // get all the words from the language
    const words = await LanguageService.getLanguageWords(
      db,
      req.language.id
    );

    // helper function to get a word at a given ID
    const getWordAt = (id) => {
      return id === null
        ? null
        : words.filter(word => word.id === id)[0];
    };

    // new linked list to hold our words (or just their IDs)
    const LL = new LinkedList();

    // the head of the list will be the word whose ID matches the language head
    let headWord = getWordAt(req.language.head);

    // keep going to the `next` to populate our linked list
    let word = headWord;
    while (word !== null) {
      LL.insertLast(word.id, word.next);
      word = getWordAt(word.next);
    }

    // check if the guess was correct
    let answer = headWord.translation;
    let isCorrect = false;

    if (guess !== answer) {
      headWord.memory_value = 1;
      headWord.incorrect_count++;
    } else {
      isCorrect = true;
      req.language.total_score++;
      headWord.correct_count++;
      headWord.memory_value *= 2;
    }

    // the node at the position of the memory valyue of head word (M)
    const newPosition = LL.findByPosition(headWord.memory_value);
    LL.remove(headWord.id);
    if (newPosition !== null) {
      LL.insertAfter(newPosition.value, headWord.id);
    } else {
      LL.insertLast(headWord.id);
    }

    // set new head
    let node = LL.head;
    LanguageService.updateLanguage(
      db,
      req.user.id,
      node.value,
      req.language.total_score
    )
      .then(() => {
        while (node !== null) {
          // persist values
          let word = getWordAt(node.value);
          if (word.id === headWord.id) {
            word = headWord;
          }
          const { correct_count, incorrect_count } = word;
          const counts = { correct_count, incorrect_count };

          LanguageService.updateWord(
            db,
            node.value,
            node.next ? node.next.value : null,
            counts
          ).then();
          node = node.next;
        }

        // send back response
        const nextWord = getWordAt(LL.head.value);
        return res.json({
          answer,
          isCorrect,
          nextWord: nextWord.original,
          totalScore: req.language.total_score,
          wordCorrectCount: nextWord.correct_count,
          wordIncorrectCount: nextWord.incorrect_count
        });

      });

  } catch (error) {
    next(error);
  }
});

module.exports = languageRouter;

