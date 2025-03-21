const Employee = require('../models/Employee');

// 📌 Get all employee notifications (Pending & In Progress tasks)
exports.getNotifications = async (req, res) => {
  try {
    // Fetch all employees and their tasks
    const employees = await Employee.find({}, 'name email tasks');

    // Extract relevant task notifications
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
};
