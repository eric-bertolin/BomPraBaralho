const mongoose = require('mongoose');

const colecaoSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  nome: { type: String, required: true },
  imagem: { type: String, required: true },
  cor: { type: String, required: true },
  tipo: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Colecao', colecaoSchema);