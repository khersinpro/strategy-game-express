const express = require('express');
const router = express.Router();
const resourceController = require('./resource.controller');

router.get('/', resourceController.getAll);

module.exports = router;