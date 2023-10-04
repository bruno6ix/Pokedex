const express = require('express');
const path = require('path');
const app = express();

const indexRouter = require('./src/routes/index')
const apiRouter = require('./src/routes/api/apiIndex');

app.set('views', path.resolve(__dirname, './src/views'));
app.set('view engine', 'ejs');

app.use(express.static(path.resolve(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));

app.use('/pokemon', indexRouter);
app.use('/api', apiRouter);

app.listen('3001', () => console.log('Servidor corriendo en el puerto 3001'));