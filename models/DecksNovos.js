const mongoose = require('mongoose');

const decksNovosSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  imagem: { type: String, required: true },
  cor: { type: String, required: false },
  cartas: { type: Array, default: [] },
  publicadoEm: { type: Date },
  avaliacao: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('DecksNovos', decksNovosSchema);
