const express = require('express');
const router = express.Router();

const { login, signup, checkAuthorized } = require('../controllers/auth');

router.post('/login', login);
router.post('/signup', signup);
router.get('/checkAuthorized', checkAuthorized);

module.exports = router;
