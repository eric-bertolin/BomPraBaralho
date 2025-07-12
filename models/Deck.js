const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  criadoEm: { type: Date, default: Date.now },
  cartas: {
    type: Map,
    of: new mongoose.Schema({
      nome: String,
      tipo: String,
      cor: String,
      imagem: String,
      quantidade: Number
    }, { _id: false })
  }
}, { timestamps: true });

module.exports = mongoose.model('Deck', deckSchema);
