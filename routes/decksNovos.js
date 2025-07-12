const express = require('express');
const router = express.Router();
const DecksNovos = require('../models/DecksNovos');

router.get('/', async (req, res) => {
  try {
    const decks = await DecksNovos.find();
    res.json(decks);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar decks novos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const deck = await DecksNovos.findById(req.params.id);
    if (!deck) return res.status(404).json({ error: 'Deck novo não encontrado' });
    res.json(deck);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar deck novo' });
  }
});

router.post('/', async (req, res) => {
  try {
    const novoDeck = new DecksNovos(req.body);
    await novoDeck.save();
    res.status(201).json(novoDeck);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar deck novo' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const atualizado = await DecksNovos.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!atualizado) return res.status(404).json({ error: 'Deck novo não encontrado' });
    res.json(atualizado);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar deck novo' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const removido = await DecksNovos.findByIdAndDelete(req.params.id);
    if (!removido) return res.status(404).json({ error: 'Deck novo não encontrado' });
    res.json({ message: 'Deck novo removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover deck novo' });
  }
});

module.exports = router;
