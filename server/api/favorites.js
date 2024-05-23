const express = require('express');
const router = express.Router();

const favoriteController = require('../controllers/favorites');

// GET /api/favorites
router.get('/groups', favoriteController.getFavoritesGroups)
router.post('/groups', favoriteController.createFavoritesGroup)
router.delete('/groups/:id', favoriteController.deleteFavoritesGroup)
router.put('/groups/:id', favoriteController.updateFavoritesGroup)

// POST /api/favorites/:text_id/:favorite_group_id
router.post('/:text_id/:favorite_group_id', favoriteController.addTextToFavoritesGroup)

// DELETE /api/favorites/:text_id/:favorite_group_id
router.delete('/:text_id/:favorite_group_id', favoriteController.deleteTextFromFavoritesGroup)



module.exports = router;
