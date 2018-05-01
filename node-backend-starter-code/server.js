// Use const to make it more explicit that these variables will never be
// rebinded to different values
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

// Add some linebreaks between separate ideas for clarity. Clear code tells a
// story!
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Don't forget the first argument -- the route where we want to serve our
// static files
app.use('/', express.static(path.join(__dirname, 'public')));

// Usually, we would use a templating engine like Pug to render our favorites in
// the server, before sending it to the client
app.get('/favorites.json', (req, res) => {
  // If we don't specify encoding, we will get a file stream
  const data = fs.readFileSync('./data.json', { encoding: 'utf8' });
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.parse(data));
});

app.post('/favorites', (req, res) => {
  if (!req.body.Title || !req.body.imdbID) {
    res.send("Error");
    return;
  }
  
  const data = JSON.parse(fs.readFileSync('./data.json', { encoding: 'utf8' }));
  data.push(req.body);

  // There are some optimizations we could make here, such as batching all
  // favorites until the user clicks on "View all favorites". Then, we could
  // write all the favorites that the user accumulated, all at once (instead of
  // doing it one-by-one)
  fs.writeFile('./data.json', JSON.stringify(data));
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
