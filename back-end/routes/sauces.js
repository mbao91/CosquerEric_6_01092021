const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const auth = require('../middelware/auth');
const multer = require('../middelware/multer-config');

router.post('/', auth, multer, saucesCtrl.createThing);

router.post('/:id/like', auth, multer, saucesCtrl.likeSauces);

router.get('/', auth, saucesCtrl.getAllSauces);
 
router.get('/:id', auth, saucesCtrl.getOneThing);

router.put('/:id', auth, multer, saucesCtrl.modifyThing);

router.delete('/:id', auth, saucesCtrl.deleteThing);

module.exports = router;