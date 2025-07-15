const express = require('express');
const router = express.Router();
const DeckFavorito = require('../models/DeckFavorito');

// Retorna todos os decks favoritos ordenados pelo saldo (likes - dislikes)
router.get('/', async (req, res) => {
  try {
    const decks = await DeckFavorito.find().sort({ saldo: -1 });
    res.json(decks);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar decks favoritos' });
  }
});

// Adiciona um novo deck favorito
router.post('/', async (req, res) => {
  try {
    const novoDeck = new DeckFavorito(req.body);
    await novoDeck.save();
    res.status(201).json(novoDeck);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar deck favorito' });
  }
});

// Atualiza likes/dislikes/saldo de um deck favorito
const mongoose = require('mongoose');

router.put('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  try {
    const { email, voto } = req.body; // voto: 'like' ou 'dislike'
    if (!email || !voto) {
      return res.status(400).json({ error: 'Email e voto são obrigatórios' });
    }
    const deck = await DeckFavorito.findById(req.params.id);
    if (!deck) return res.status(404).json({ error: 'Deck favorito não encontrado' });

    // Remove voto anterior do usuário, se existir
    deck.votos = deck.votos.filter(v => v.email !== email);
    // Adiciona novo voto
    deck.votos.push({ email, voto });

    // Recalcula likes, dislikes e saldo
    deck.likes = deck.votos.filter(v => v.voto === 'like').length;
    deck.dislikes = deck.votos.filter(v => v.voto === 'dislike').length;
    deck.saldo = deck.likes - deck.dislikes;

    await deck.save();
    res.json(deck);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Erro ao atualizar deck favorito' });
  }
});

// Remove um deck favorito
router.delete('/:id', async (req, res) => {
  try {
    const removido = await DeckFavorito.findByIdAndDelete(req.params.id);
    if (!removido) return res.status(404).json({ error: 'Deck favorito não encontrado' });
    res.json(removido);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao remover deck favorito' });
  }
});

module.exports = router;
