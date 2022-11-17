const express = require('express');
const app = express();

app.listen(3000);

app.get('/', function (req, res) {
  res.send('Hola');
});

app.get('/api', function (req, res) {
  const obj = {
    nombre: 'prueba,',
    framework: 'express',
    ventaja: 'serializó por nosotros',
  };
  res.json(obj);
});

//$String patterns
app.get('/ab?cd', function (req, res) {
  res.send('ab?cd');
});

app.get('/ab*cd', function (req, res) {
  res.send('ab*cd');
});

//$ params
app.get('/api/:id/:nombre/:valor', function (req, res) {
  res.json({ id: req.params.id, nombre: req.params.nombre, valor: req.params.valor });
});

//$ static elements
app.get('/static', function (req, res) {
  res.send(
    '<html><head> \
      <link href="/assets/style.css" rel="stylesheet"> \
      </head><body> \
      <p>Archivos estaticos rapido y facil!!</p>\
      <img src="/assets/imagen.jpg">\
      </body></html>'
  );
});
