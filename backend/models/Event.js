const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventType: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  description: { type: String },
  availableSlots: { type: Number },
  isPaid: { type: Boolean, default: false },
  tasks: [{ 
    taskName: { type: String, required: true },
    description : {type: String},
    assignedTo: { type: String, required: true },
    deadline: { type: Date, required: true },
    budget: { type: Number, required: true },
    status: { type: String, default: "Pending" }
  }]
});

module.exports = mongoose.model('Event', eventSchema);

