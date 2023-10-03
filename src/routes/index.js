const express = require('express');
const router = express.Router();
const mainController = require('../controller/mainController');
const apiMainController = require('../controller/api/apiMainController');


router.get('/', mainController.index);

router.post('/buscar', mainController.buscar);

module.exports = router;