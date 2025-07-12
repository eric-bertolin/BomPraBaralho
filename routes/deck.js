const express = require('express');
const router = express.Router();
const Deck = require('../models/Deck');

router.get('/', async (req, res) => {
  try {
    const decks = await Deck.find();
    res.json(decks);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar decks' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ error: 'Deck não encontrado' });
    res.json(deck);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar deck' });
  }
});

router.post('/', async (req, res) => {
  try {
    const novoDeck = new Deck(req.body);
    await novoDeck.save();
    res.status(201).json(novoDeck);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar deck' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const atualizado = await Deck.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!atualizado) return res.status(404).json({ error: 'Deck não encontrado' });
    res.json(atualizado);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar deck' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const removido = await Deck.findByIdAndDelete(req.params.id);
    if (!removido) return res.status(404).json({ error: 'Deck não encontrado' });
    res.json({ message: 'Deck removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover deck' });
  }
});

module.exports = router;
