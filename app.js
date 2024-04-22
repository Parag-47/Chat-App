const path = require('node:path');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/*', (req,res)=>{
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;