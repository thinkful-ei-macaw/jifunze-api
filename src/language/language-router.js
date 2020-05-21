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

    // helper function to find the index of a word
    const getIndex = (id) => {
      return words.findIndex(word => word.id === id);
    }

    // new linked list to hold our words (or just their IDs)
    const wordList = new LinkedList();

    // insert words into list
    let word = getWordAt(req.language.head);
    while (word !== null) {
      wordList.insertLast(word.id, word.next);
      word = getWordAt(word.next);
    }

    // this is what happens when an answer gets submitted
    let index = getIndex(req.language.head);
    let currentWord = words[index];
    let answer = currentWord.translation;
    let isCorrect = false;
    if (guess === answer) {
      isCorrect = true;
      req.language.total_score++;
      currentWord.correct_count++;
      currentWord.memory_value *= 2;
    } else {
      currentWord.incorrect_count++;
      currentWord.memory_value = 1;
    }

    // remove current word
    wordList.remove(currentWord.id);

    // insert it at it's new memory value position
    wordList.insertAt(currentWord.memory_value, currentWord.id);

    // update the head
    const head = wordList.head.value;
    const totalScore = req.language.total_score;
    LanguageService.updateLanguage(db, req.user.id, head, totalScore)
      .then(() => {

        // persist the changes
        let node = wordList.head;
        while (node !== null) {
          const word = getWordAt(node.value);
          const data = {
            next: node.next ? node.next.value : null,
            memory_value: word.memory_value,
            correct_count: word.correct_count,
            incorrect_count: word.incorrect_count
          };
          LanguageService.updateWord(
            db, node.value, data
          ).then(() => {
            // this only exists so that the query actually runs
          });
          node = node.next;
        }

        // respond
        const nextWord = getWordAt(head);
        res.json({
          answer,
          isCorrect,
          totalScore,
          nextWord: nextWord.original,
          wordCorrectCount: nextWord.correct_count,
          wordIncorrectCount: nextWord.incorrect_count
        });

      });

  } catch (error) {
    next(error);
  }
});

module.exports = languageRouter;