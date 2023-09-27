const express = require('express');
const router = express.Router();
const civilizationController = require('./civilization.controller');
const { isAdmin } = require('../../middlewares/auth');

// Route for Admins
router.get('/', isAdmin, civilizationController.getAll);
router.get('/:name', isAdmin, civilizationController.get);
router.post('/', isAdmin, civilizationController.create);
router.put('/:name', isAdmin, civilizationController.update);
router.delete('/:name', isAdmin, civilizationController.delete);

module.exports = router;