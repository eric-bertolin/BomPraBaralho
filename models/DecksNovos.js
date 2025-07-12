const mongoose = require('mongoose');

const decksNovosSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  imagem: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('DecksNovos', decksNovosSchema);
