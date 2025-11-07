const express = require('express');
const router = express.Router();
const controller = require('../controllers/feedbackController');
const auth = require('../middleware/auth');

router.post('/feedback', controller.submit); // public submit
router.get('/summary', controller.summary); // public summary
router.get('/feedbacks', auth, controller.myFeedbacks); // user history (auth required)
router.get('/all', auth, controller.allFeedbacks); // admin protected list
router.delete('/feedback/:id', auth, controller.deleteById); // admin delete negative only

module.exports = router;
