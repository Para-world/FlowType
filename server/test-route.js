const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
app.use((req, res, next) => {
  res.status(404).send(`Cannot find ${req.method} ${req.originalUrl}`);
});
const request = require('http').request;

app.listen(5001, () => {
  const req = request('http://localhost:5001/api/users/avatar', { method: 'POST' }, (res) => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => {
      console.log('Response:', res.statusCode, data);
      process.exit(0);
    });
  });
  req.end();
});
