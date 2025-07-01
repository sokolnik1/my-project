const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Генерация JWT токена
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Регистрация пользователя
const registerUser = async (req, res) => {
  const { fullName, email, password, profileImageUrl } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "Все поля обязательны для заполнения" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email уже зарегистрирован" });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
    });

    res.status(201).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({
      message: "Ошибка при регистрации пользователя",
      error: err.message,
    });
  }
};

// Авторизация пользователя
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Требуется email и пароль" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Неверные данные" });
    }

    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({
      message: "Ошибка при авторизации",
      error: err.message,
    });
  }
};

// Получение информации о пользователе
const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: "Ошибка при получении данных пользователя",
      error: err.message,
    });
  }
};

// Получение кастомных лимитов
const getCustomLimits = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Пользователь не найден" });

    res.status(200).json({ customLimits: user.customLimits || [] });
  } catch (err) {
    res.status(500).json({
      message: "Ошибка при получении лимитов",
      error: err.message,
    });
  }
};

// Добавление кастомного лимита
const addCustomLimit = async (req, res) => {
  const { startDate, endDate, limit } = req.body;

  if (!startDate || !endDate || !limit) {
    return res.status(400).json({ message: "Все поля обязательны" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Пользователь не найден" });

    const newLimit = {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      limit: Number(limit),
    };

    user.customLimits.push(newLimit);
    await user.save();

    res.status(201).json({ message: "Кастомный лимит добавлен", customLimits: user.customLimits });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при добавлении лимита", error: error.message });
  }
};

// Экспорт всех функций
module.exports = {
  registerUser,
  loginUser,
  getUserInfo,
  getCustomLimits,
  addCustomLimit,
};

