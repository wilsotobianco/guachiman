const express = require('express');
const app = express();
const port = 3000;

app.use('/', express.static('sandbox'));
app.use('/static', express.static('dist'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(
    `Server to test Guachiman up and running at http://localhost:${port}`
  );
});
