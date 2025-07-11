const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const dbPath = path.join(__dirname, '..', 'db.json');

// Lê o conteúdo do db.json toda vez que a rota é acessada
function getDB() {
  const raw = fs.readFileSync(dbPath);
  return JSON.parse(raw);
}

router.get('/cartas', (req, res) => res.json(getDB().cartas));
router.get('/colecao', (req, res) => res.json(getDB().colecao));
router.get('/decks', (req, res) => res.json(getDB().decks));
router.get('/novidades', (req, res) => res.json(getDB().novidades));
router.get('/decksSemana', (req, res) => res.json(getDB().decksSemana));
router.get('/favoritos', (req, res) => res.json(getDB().favoritos));
router.get('/decksNovos', (req, res) => res.json(getDB().decksNovos));
router.get('/decksMelhores', (req, res) => res.json(getDB().decksMelhores));

module.exports = router;
