const express = require('express');
const router = express.Router();
const Core = require('../../modules/Core');

router.get('/api/getMainImage', (req, res, next) => {
	Core.getMainImage(data => res.json(data));
});

module.exports = router;