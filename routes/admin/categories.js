const exp = require('express');
const router = exp.Router();
const adminController = require('../../controllers/admin');
const isAuth = require('../../middlewares/auth');

router.get("/create",isAuth, adminController.get_category_create);
router.post("/create", isAuth, adminController.post_category_create);
router.get("/edit/:categoryId", isAuth, adminController.get_category_edit);
router.post("/edit/:categoryId",isAuth, adminController.post_category_edit);
router.get("/delete/:categoryId", isAuth, adminController.get_category_delete);
router.post("/delete/:categoryId", isAuth, adminController.post_category_delete);
router.get("/delete-all", isAuth, adminController.get_category_delete_all);
router.post("/delete-all", isAuth, adminController.post_category_delete_all);
router.post("/remove-course", isAuth, adminController.get_remove_course_from_category);
router.get("/", isAuth, adminController.get_category_list);
module.exports = router;
