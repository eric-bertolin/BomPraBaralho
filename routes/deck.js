const express = require('express');
const router = express.Router();
const Deck = require('../models/Deck');
const authenticateJWT = require('../middlewares/authMiddleware');


router.get('/', authenticateJWT, async (req, res) => {
  try {
    const decks = await Deck.find({ userEmail: req.user.email });
    res.json(decks);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar decks' });
  }
});

router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const deck = await Deck.findOne({ _id: req.params.id, userEmail: req.user.email });
    if (!deck) return res.status(404).json({ error: 'Deck não encontrado ou sem permissão' });
    res.json(deck);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar deck' });
  }
});

router.post('/', authenticateJWT, async (req, res) => {
  const { nome, cartas } = req.body;
  // Verifica se já existe deck salvo com mesmo nome e userEmail
  const jaExiste = await Deck.findOne({ nome, userEmail: req.user.email });
  if (jaExiste) {
    return res.status(409).json({ error: 'Deck já salvo por este usuário!' });
  }
  // Converte cartas para Map se vier como objeto
  let cartasMap = cartas;
  if (cartas && !(cartas instanceof Map)) {
    cartasMap = new Map(Object.entries(cartas));
  }
  const novoDeck = new Deck({
    nome,
    cartas: cartasMap,
    userEmail: req.user.email,
    criadoEm: new Date()
  });
  await novoDeck.save();
  res.status(201).json(novoDeck);
});

router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const atualizado = await Deck.findOneAndUpdate(
      { _id: req.params.id, userEmail: req.user.email },
      req.body,
      { new: true }
    );
    if (!atualizado) return res.status(404).json({ error: 'Deck não encontrado ou sem permissão' });
    res.json(atualizado);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar deck' });
  }
});

router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    console.log('Tentando remover deck com id:', req.params.id, 'e userEmail:', req.user.email);
    const removido = await Deck.findOneAndDelete({
      _id: req.params.id,
      userEmail: req.user.email
    });
    if (!removido) {
      console.log('Deck não encontrado para remoção:', req.params.id);
      return res.status(404).json({ error: 'Deck não encontrado ou sem permissão' });
    }
    console.log('Deck removido com sucesso:', req.params.id);
    res.json({ message: 'Deck removido com sucesso' });
  } catch (err) {
    console.error('Erro ao remover deck:', err);
    res.status(500).json({ error: 'Erro ao remover deck' });
  }
});

module.exports = router;
