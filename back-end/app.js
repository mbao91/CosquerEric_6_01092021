const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path'); 
const helmet = require('helmet');

const saucesRoute = require('./routes/sauces');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://eric1stusr:Abcdef91@cluster0.7gvrz.mongodb.net/test1?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussi !'))
  .catch(() => console.log('Conneion à MongoDB échouée !'));

const app = express();

/*app.use((req, res) => {
    res.json({message: 'Votre requête a bien été reçue'});
});*/

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Set-Cookie', 'foo=bar; HttpOnly');
    next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'image')));
app.use(helmet());
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoute);

module.exports = app;