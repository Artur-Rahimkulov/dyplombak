const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

// GET /api/user
router.get('/', userController.getUser)


// PUT /api/user
router.put('/', userController.updateUser)




module.exports = router;
