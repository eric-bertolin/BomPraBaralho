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
  try {
    const novoDeck = new Deck({
      ...req.body,
      userEmail: req.user.email
    });
    await novoDeck.save();
    res.status(201).json(novoDeck);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar deck' });
  }
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
    const removido = await Deck.findOneAndDelete({
      _id: req.params.id,
      userEmail: req.user.email
    });
    if (!removido) return res.status(404).json({ error: 'Deck não encontrado ou sem permissão' });
    res.json({ message: 'Deck removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover deck' });
  }
});

module.exports = router;
