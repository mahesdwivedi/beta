var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("home");
});

// GET User Detail
router.get('/userProfile', function(req, res, next) {
  res.render("profile");
});

module.exports = router;
