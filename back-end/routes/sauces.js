const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const auth = require('../middelware/auth');
const multer = require('../middelware/multer-config');

router.post('/', auth, multer, saucesCtrl.createSauce);

router.post('/:id/like', auth, multer, saucesCtrl.likeSauces);

router.get('/', auth, saucesCtrl.getAllSauces);
 
router.get('/:id', auth, saucesCtrl.getOneSauce);

router.put('/:id', auth, multer, saucesCtrl.modifySauce);

router.delete('/:id', auth, saucesCtrl.deleteSauce);

module.exports = router;