const exp = require('express');
const router = exp.Router();
const userController = require('../../controllers/user');
router.get("/courses/:slug", userController.get_course_details);
router.get("/courses", userController.get_course_list);
router.get("/", userController.get_popular_courses);
module.exports = router;

