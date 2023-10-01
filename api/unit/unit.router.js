const express = require('express')
const router = express.Router()
const { Unit } = require('../../database/index').models

router.get('/', async (req, res) => {
  const units = await Unit.findAll()
  res.json(units)
})


module.exports = router