const mongoose = require('mongoose');

const novidadeSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  imagem: { type: String, required: true },
  link: { type: String, required: false } 
}, { timestamps: true });

module.exports = mongoose.model('Novidade', novidadeSchema);
