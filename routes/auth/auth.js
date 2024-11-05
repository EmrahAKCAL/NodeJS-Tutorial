const exp = require('express');
const router = exp.Router();
const authController = require('../../controllers/auth');

router.get("/register", authController.get_register);
router.post("/register", authController.post_register);
router.get("/login", authController.get_login);

module.exports = router;
