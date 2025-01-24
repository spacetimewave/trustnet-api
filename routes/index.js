var express = require('express');
var router = express.Router();

// Dependency Injection
const DatabaseRepository = require('../repositories/DatabaseRepository');
const couchDbUrl = 'http://localhost:5984';
const dbName = 'trustnet-db';
const dbRepo = new DatabaseRepository(couchDbUrl, dbName);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('sample/:username', async function(req, res, next) {
  const username = req.params.username;
  try {
    const account = await dbRepo.getDocument(username);
    if (!account) {
      res.sendStatus(404);
      return;
    }
    res.json(account);
  } catch (error) {
    res.status(500).send(`Error retrieving account: ${error.message}`);
  }
});

router.get('/api/v1/dns/search/username/:username', function(req, res, next) {
  let account = {seed:"1234"}
  if(account === undefined){
    res.sendStatus(404);
    return;
  }
  res.json(account);
});

module.exports = router;
