const express = require('express');
const textsController = require('../controllers/texts');
const router = express.Router();

// GET /api/texts
router.get('/', textsController.getAllTexts)
// GET /api/texts/:id
router.get('/edit/:id', textsController.getTextForEdit)
router.get('/read/:id', textsController.getTextForRead)
router.get('/read_with_access_link/:access_link', textsController.getTextForReadWithAccess_link)


// POST /api/texts
router.post('/', textsController.createText)
router.post('/copy/:id', textsController.copyText)

// PUT /api/texts/:id
router.put('/:id', textsController.updateText)
router.put('/access_level/:id', textsController.updateTextAccessLevel)
router.put('/access_link/:id', textsController.updateAccess_link)

// DELETE /api/texts/:id
router.delete('/:id', textsController.deleteText)
router.delete('/access_link/:id', textsController.deleteAccess_link)



module.exports = router;
