const mongoose = require("mongoose");

const CustomLimitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  limit: { type: Number, required: true },
});

module.exports = mongoose.model("CustomLimit", CustomLimitSchema);
