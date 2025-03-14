const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  team: { type: String, default: "" },
  tasks: [
    {
      taskName: { type: String, required: true },
      description: { type: String, required: true },
      deadline: { type: Date, required: true },
      status: { type: String, enum: ["Pending", "In Progress"], default: "Pending" }
    }
  ]
});

module.exports = mongoose.model('Employee', employeeSchema);




