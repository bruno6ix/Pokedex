const express = require('express');
const router = express.Router();
const apiMainController = require('../../controller/api/apiMainController');

router.get('/list', apiMainController.index);

module.exports = router;