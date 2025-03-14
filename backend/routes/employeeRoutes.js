const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// 📌 Fetch pending/in-progress tasks for all employees
router.get('/notifications', async (req, res) => {
  try {
    // Fetch employees and their tasks
    const employees = await Employee.find({}, 'name email tasks');

    // Extract tasks that are still pending or in progress
    const notifications = employees.flatMap(emp =>
      emp.tasks
        .filter(task => task.status === "Pending" || task.status === "In Progress")
        .map(task => ({
          employeeName: emp.name,
          employeeEmail: emp.email,
          taskName: task.taskName,
          description: task.description,
          deadline: task.deadline,
          status: task.status,
          eventName: task.eventName
        }))
    );

    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

module.exports = router;

