
var express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/BPBDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB'))
.catch((err) => {
  console.error('Erro ao conectar ao MongoDB:', err.message);
  process.exit(1); 
});
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const authRoutes = require('./routes/auth');
const routes = require('./routes');
app.use('/auth', authRoutes);
app.use('/api', routes);

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

module.exports = app;
