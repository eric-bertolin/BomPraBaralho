const express = require('express');
const router = express.Router();
const Colecao = require('../models/colecao');

router.get('/', async (req, res) => {
  try {
    const colecao = await Colecao.find();
    res.json(colecao);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar coleção' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const carta = await Colecao.findById(req.params.id);
    if (!carta) return res.status(404).json({ error: 'Carta não encontrada na coleção' });
    res.json(carta);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar carta da coleção' });
  }
});

router.post('/', async (req, res) => {
  try {
    const novaCarta = new Colecao(req.body);
    await novaCarta.save();
    res.status(201).json(novaCarta);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao adicionar carta à coleção' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const removida = await Colecao.findByIdAndDelete(req.params.id);
    if (!removida) return res.status(404).json({ error: 'Carta não encontrada na coleção' });
    res.json({ message: 'Carta removida da coleção com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover carta da coleção' });
  }
});

module.exports = router;
