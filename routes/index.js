const express = require('express');
const router = express.Router();

const cartasRoutes = require('./cartas');
const decksRoutes = require('./deck');
const colecaoRoutes = require('./colecao');
const novidadesRoutes = require('./novidades');
const decksNovosRoutes = require('./decksNovos');
const decksFavoritosRoutes = require('./decksFavoritos');

router.use('/cartas', cartasRoutes);
router.use('/decks', decksRoutes);
router.use('/colecao', colecaoRoutes);
router.use('/novidades', novidadesRoutes);
router.use('/decksNovos', decksNovosRoutes);
router.use('/decksFavoritos', decksFavoritosRoutes);

module.exports = router;
