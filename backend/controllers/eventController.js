const Event = require('../models/Event');
const Employee = require('../models/Employee');
const Task = require('../models/Task');
const { sendTaskNotification } = require('./notificationController'); // Import notification function

// Create event
exports.createEvent = async (req, res) => {
  const { eventName, eventType, date, venue, description, availableSlots, isPaid, tasks } = req.body;

  // Validate tasks array
  if (!Array.isArray(tasks)) {
    return res.status(400).json({ error: "Tasks must be an array" });
  }

  try {
    // Prepare tasks array for event creation
    let tasksArray = tasks.map(task => ({
      taskName: task.taskName,
      description: task.description || "",
      assignedTo: task.assignedTo,
      deadline: task.deadline,
      budget: task.budget || 0,
      status: task.status || "Pending",
      eventName: eventName 
    }));

    // Create the event
    const newEvent = new Event({
      eventName,
      eventType,
      date,
      venue,
      description,
      availableSlots,
      isPaid,
      tasks: tasksArray
    });

    await newEvent.save();

    // Fetch all employees in advance to reduce DB queries
    const employees = await Employee.find({ email: { $in: tasks.map(task => task.assignedTo) } });

    // Handle task assignment, employee update, and task saving
    const taskPromises = tasksArray.map(async (task) => {
      // Find employee
      let employee = employees.find(emp => emp.email === task.assignedTo);
      if (!employee) {
        console.warn(`Employee with email ${task.assignedTo} not found.`);
        return; // Skip if employee not found
      }

      // Add task to employee's `tasks` array and save
      employee.tasks.push({
        taskName: task.taskName,
        description: task.description,
        deadline: task.deadline,
        status: "Pending",
        eventName: task.eventName
      });
      await employee.save();

      // Save task in Task collection
      const newTask = new Task({
        taskName: task.taskName,
        description: task.description,
        assignedTo: task.assignedTo,
        deadline: task.deadline,
        eventName: task.eventName
      });
      await newTask.save();

      // Send task notification
      sendTaskNotification(task.assignedTo, task);
    });

    // Wait for all task-related operations to complete
    await Promise.all(taskPromises);

    // Send success response
    res.status(201).json({
      message: 'Event created, tasks assigned, and notifications sent.',
      event: newEvent,
      taskCount: tasksArray.length
    });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get event by eventName
exports.getEventByEventName = async (req, res) => {
  const { eventName } = req.params;

  try {
    const event = await Event.findOne({ eventName });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (err) {
    console.error('Error retrieving event:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update event by eventName
exports.updateEvent = async (req, res) => {
  const { eventName } = req.params;
  const { eventType, date, venue, description, availableSlots, isPaid, tasks } = req.body;

  try {
    const updatedEvent = await Event.findOneAndUpdate(
      { eventName },
      { eventType, date, venue, description, availableSlots, isPaid, tasks },
      { new: true } // Return the updated event
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(updatedEvent);
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete event by eventName
exports.deleteEvent = async (req, res) => {
  const { eventName } = req.params;

  try {
    const deletedEvent = await Event.findOneAndDelete({ eventName });

    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


