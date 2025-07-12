const express = require('express');
const router = express.Router();
const Novidade = require('../models/Novidade');

router.get('/', async (req, res) => {
  try {
    const novidades = await Novidade.find();
    res.json(novidades);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar novidades' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const novidade = await Novidade.findById(req.params.id);
    if (!novidade) return res.status(404).json({ error: 'Novidade não encontrada' });
    res.json(novidade);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar novidade' });
  }
});

router.post('/', async (req, res) => {
  try {
    const nova = new Novidade(req.body);
    await nova.save();
    res.status(201).json(nova);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar novidade' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const atualizada = await Novidade.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!atualizada) return res.status(404).json({ error: 'Novidade não encontrada' });
    res.json(atualizada);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar novidade' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const removida = await Novidade.findByIdAndDelete(req.params.id);
    if (!removida) return res.status(404).json({ error: 'Novidade não encontrada' });
    res.json({ message: 'Novidade removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover novidade' });
  }
});

module.exports = router;
