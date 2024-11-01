const exp = require('express');
const router = exp.Router();
const adminController = require('../../controllers/admin');

router.get("/create", adminController.get_category_create);
router.post("/create", adminController.post_category_create);
router.get("/edit/:categoryId",adminController.get_category_edit);
router.post("/edit/:categoryId", adminController.post_category_edit);
router.get("/delete/:categoryId", adminController.get_category_delete);
router.post("/delete/:categoryId", adminController.post_category_delete);
router.get("/delete-all", adminController.get_category_delete_all);
router.post("/delete-all", adminController.post_category_delete_all);
router.post("/remove-course", adminController.get_remove_course_from_category);
router.get("/", adminController.get_category_list);
module.exports = router;
