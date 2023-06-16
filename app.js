const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Serve static files from the Frontend directory
app.use(express.static(path.join(__dirname, '/dist/FrontEnd')));

// Parse JSON request bodies
app.use(bodyParser.json());

// Connect to MongoDB database
mongoose.connect('mongodb+srv://officialsabarinarayan:9447103050@cluster0.buyzcu4.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define the Employee schema
const employeeSchema = new mongoose.Schema({
  name: String,
  location: String,
  position: String,
  salary: Number
});

// Create the Employee model
const Employee = mongoose.model('Employee', employeeSchema);

// Get all employees
app.get('/api/employeelist', (req, res) => {
  Employee.find({}, (err, employees) => {
    if (err) {
      console.error('Error retrieving employees:', err);
      res.status(500).json({ error: 'Error retrieving employees' });
    } else {
      res.json(employees);
    }
  });
});

// Get a single employee by ID
app.get('/api/employeelist/:id', (req, res) => {
  const employeeId = req.params.id;

  Employee.findById(employeeId, (err, employee) => {
    if (err) {
      console.error('Error retrieving employee:', err);
      res.status(500).json({ error: 'Error retrieving employee' });
    } else if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
    } else {
      res.json(employee);
    }
  });
});

// Add a new employee
app.post('/api/employeelist', (req, res) => {
  const newEmployee = req.body;

  Employee.create(newEmployee, (err, employee) => {
    if (err) {
      console.error('Error adding employee:', err);
      res.status(500).json({ error: 'Error adding employee' });
    } else {
      res.json(employee);
    }
  });
});

// Delete an employee by ID
app.delete('/api/employeelist/:id', (req, res) => {
  const employeeId = req.params.id;

  Employee.findByIdAndDelete(employeeId, (err, employee) => {
    if (err) {
      console.error('Error deleting employee:', err);
      res.status(500).json({ error: 'Error deleting employee' });
    } else if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
    } else {
      res.json({ message: 'Employee deleted successfully' });
    }
  });
});

// Update an employee by ID
app.put('/api/employeelist/:id', (req, res) => {
    const employeeId = req.params.id;
    const updatedEmployee = req.body;
  
    Employee.findByIdAndUpdate(employeeId, updatedEmployee, { new: true }, (err, employee) => {
      if (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ error: 'Error updating employee' });
      } else if (!employee) {
        res.status(404).json({ error: 'Employee not found' });
      } else {
        res.json(employee);
      }
    });
  }); 
  app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

  
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
  });