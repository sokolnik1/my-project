const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");
const limitController = require("../controllers/limitController");

// Авторизация и регистрация
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/getUser", protect, authController.getUserInfo);

// Лимиты бюджета
router.get("/budget-limits", protect, limitController.getBudgetLimits);
router.patch("/budget-limits", protect, limitController.updateBudgetLimits);
router.post("/custom-limits", protect, limitController.addCustomLimit);
router.get("/custom-limits", protect, limitController.getCustomLimits);

module.exports = router;



