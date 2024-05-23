const express = require('express');
const router = express.Router();

const ratingController = require('../controllers/rating');

router.post('/:id/:rating', ratingController.rateText);


module.exports = router;
