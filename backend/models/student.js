const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  gender: String,
  dob: Date,
  field: String,
  email: { type: String, unique: true },
  quota: String,
  location: String,
});

module.exports = mongoose.model("Student", studentSchema);
