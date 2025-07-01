const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const CustomLimitSchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  limit: { type: Number, required: true },
}, { timestamps: true });

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null },
    weekLimit: { type: Number, default: 10000 },
    monthLimit: { type: Number, default: 40000 },
    customLimits: [CustomLimitSchema]
  },
  { timestamps: true }
);

// Хэширование пароля перед сохранением
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});
// Метод для проверки пароля
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);


