var express = require('express');
var base = require('./base_datos.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(base);
  return res.send('Received a GET HTTP method');
});

module.exports = router;
