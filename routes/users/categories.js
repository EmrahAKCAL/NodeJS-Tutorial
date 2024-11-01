const exp = require('express');
const router = exp.Router();
const userController = require('../../controllers/user');

router.get("/:slug/courses", userController.get_courses_by_category);

module.exports = router;

