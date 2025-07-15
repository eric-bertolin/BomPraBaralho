const mongoose = require('mongoose');

const votoSchema = new mongoose.Schema({
  email: String,
  voto: String // 'like' ou 'dislike'
});

const deckFavoritoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cor: { type: String },
  imagem: { type: String },
  cartas: { type: Array, default: [] },
  publicadoEm: { type: Date },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  saldo: { type: Number, default: 0 },
  votos: [votoSchema],
}, { timestamps: true });

module.exports = mongoose.model('DeckFavorito', deckFavoritoSchema);
