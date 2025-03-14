
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  description : {type: String},
  deadline: { type: Date, required: true },
  assignedTo: { type: String, required: true },
  eventName: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
});

module.exports = mongoose.model('Task', taskSchema);
