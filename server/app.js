const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')

const app = express();

const DIST_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');

app.get('/', (req, res) => {
    res.sendFile(HTML_FILE);
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(DIST_DIR));
app.use(require('./calendar/routes'));

module.exports = app