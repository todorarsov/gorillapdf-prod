const express = require('express');
const router = express.Router();
const pdfStats = require('../services/statistics')

router.get('/', function(req, res) {
    res.send('Gorilla Files API')
}).use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });


  router.get('/dashboard', async (req, res) => {
    try {
      const getStats = await pdfStats.getStatistics();
      res.render('dashboard', { statsData: getStats }); 
    } catch (err) {
      console.error(err.stack);
      res.status(500).json({ error: 'An error occurred while fetching statistics.' });
    }
  });
  

module.exports = router;