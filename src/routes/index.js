const express = require('express');
const router = express.Router();
const mainController = require('../controller/mainController');
const apiMainController = require('../controller/api/apiMainController');


router.get('/list', mainController.index);

router.post('/resultado', mainController.buscar);

router.get('/detail/:id', mainController.detail)

module.exports = router;