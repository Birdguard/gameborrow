var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
