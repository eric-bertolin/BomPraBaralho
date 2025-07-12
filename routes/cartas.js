const express = require('express');
const router = express.Router();
const Carta = require('../models/Carta');

router.get('/', async (req, res) => {
  try {
    const cartas = await Carta.find();
    res.json(cartas);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar cartas' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const carta = await Carta.findById(req.params.id);
    if (!carta) return res.status(404).json({ error: 'Carta não encontrada' });
    res.json(carta);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar carta' });
  }
});

router.post('/', async (req, res) => {
  try {
    const novaCarta = new Carta(req.body);
    await novaCarta.save();
    res.status(201).json(novaCarta);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar carta' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const atualizada = await Carta.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!atualizada) return res.status(404).json({ error: 'Carta não encontrada' });
    res.json(atualizada);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar carta' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const removida = await Carta.findByIdAndDelete(req.params.id);
    if (!removida) return res.status(404).json({ error: 'Carta não encontrada' });
    res.json({ message: 'Carta removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover carta' });
  }
});

module.exports = router;
