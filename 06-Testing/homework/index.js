const express = require('express');
const app = express();

app.use(express.json()); // for parsing application/json

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'hola',
  });
});

app.get('/test', (req, res) => {
  res.status(200).json({ message: 'test' });
});

app.post('/sum', (req, res) => {
  const { a, b } = req.body;
  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({ error: 'bad request' });
  }
  res.status(200).json({ result: a + b });
});

app.post('/product', (req, res) => {
  const { a, b } = req.body;
  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({ error: 'bad request' });
  }
  res.json({
    result: a * b,
  });
});

app.post('/sumArray', (req, res) => {
  const { array, num } = req.body;
  let arr = Array.from(new Set(array));
  if (!Array.isArray(array) || isNaN(num)) {
    return res.status(400).json({ error: 'Bad request' });
  }
  let isNum = false;
  for (n in arr) {
    isNum = !arr.every((value, i) => {
      if (n === i) return true;
      if (value + arr[n] === num) {
        return false;
      } else {
        return true;
      }
    });
    if (isNum) {
      break;
    }
  }
  res.status(200).json({ result: isNum });
});

app.post('/numString', (req, res) => {
  if (typeof req.body.string !== 'string' || !req.body.string) {
    res.status(400).json({ error: 'Bad request' });
  } else {
    res.status(200).json({ result: req.body.string.length });
  }
});

app.post('/pluck', (req, res) => {
  const { array, prop } = req.body;
  if (!Array.isArray(array) || !prop) {
    res.status(400).json({ error: 'Bad request' });
  } else {
    const result = array.filter(el => Object.values(el).includes(prop));
    res.status(200).json({ result });
  }
});

module.exports = app; // Exportamos app para que supertest session la pueda ejecutar