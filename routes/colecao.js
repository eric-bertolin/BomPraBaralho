const express = require('express');
const router = express.Router();
const Colecao = require('../models/colecao');
const authenticateJWT = require('../middlewares/authMiddleware');

router.get('/', authenticateJWT, async (req, res) => {
  try {
    const colecao = await Colecao.find({ userEmail: req.user.email });
    res.json(colecao);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar coleção' });
  }
});

router.post('/', authenticateJWT, async (req, res) => {
  try {
    const novaCarta = new Colecao({
      ...req.body,
      userEmail: req.user.email
    });
    await novaCarta.save();
    res.status(201).json(novaCarta);
  } catch (err) {
    console.error(' Erro ao adicionar à coleção:', err.message);
    res.status(400).json({ error: 'Erro ao adicionar carta' });
  }
});

router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const cartaRemovida = await Colecao.findOneAndDelete({
      _id: req.params.id,
      userEmail: req.user.email
    });

    if (!cartaRemovida) {
      return res.status(404).json({ error: 'Carta não encontrada ou sem permissão' });
    }

    res.json({ message: 'Carta removida da coleção com sucesso' });
  } catch (err) {
    console.error('❌ Erro ao remover carta:', err.message);
    res.status(500).json({ error: 'Erro ao remover carta da coleção' });
  }
});

module.exports = router;
