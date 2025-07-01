const User = require("../models/User");

// Получить все лимиты пользователя
exports.getBudgetLimits = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('weekLimit monthLimit customLimits');
    
    // Получаем последний кастомный лимит
    const lastCustomLimit = user.customLimits?.length > 0 
      ? user.customLimits[user.customLimits.length - 1]
      : null;

    res.status(200).json({
      weekLimit: user.weekLimit,
      monthLimit: user.monthLimit,
      customLimits: user.customLimits || [],
      lastCustomLimit: lastCustomLimit
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Ошибка при получении лимитов",
      error: err.message 
    });
  }
};

// Обновить недельный/месячный лимиты
exports.updateBudgetLimits = async (req, res) => {
  const { weekLimit, monthLimit } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          weekLimit: Number(weekLimit),
          monthLimit: Number(monthLimit)
        }
      },
      { new: true }
    ).select('weekLimit monthLimit');

    res.status(200).json({
      weekLimit: updatedUser.weekLimit,
      monthLimit: updatedUser.monthLimit
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Ошибка при обновлении лимитов",
      error: err.message 
    });
  }
};

// Добавить кастомный лимит
exports.addCustomLimit = async (req, res) => {
  const { startDate, endDate, limit } = req.body;

  try {
    const newLimit = {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      limit: Number(limit)
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { 
          customLimits: {
            $each: [newLimit],
            $slice: -10 // Сохраняем только последние 10 лимитов
          }
        }
      },
      { new: true }
    );

    res.status(201).json({
      message: "Кастомный лимит добавлен",
      customLimit: newLimit,
      customLimits: updatedUser.customLimits
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Ошибка при добавлении лимита",
      error: err.message 
    });
  }
};

// Получить кастомные лимиты
exports.getCustomLimits = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('customLimits');
    
    res.status(200).json({
      customLimits: user.customLimits || []
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Ошибка при получении лимитов",
      error: err.message 
    });
  }
};
  
