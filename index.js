const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Your application code here

const path = require('path');

// Define the MongoDB connection string
const uri =
  'mongodb+srv://shamoon1997:mongodbatlas123@mongopracticestart.vdf7o.mongodb.net/bnbtest?retryWrites=true&w=majority'; //
const mongoose = require('mongoose'); //
mongoose.connect(uri);

// Import the required models
const login = require('./Model/Login');
const Contact = require('./Model/Contact');
const Admin = require('./Model/Admin');

const Employee = require('./Model/Employee');
// Set up file upload
const dir = './uploads';

// Set up middleware
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* login api */
app.post('/login', async (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {
      const isAdmin = await Admin.find({
        username: req.body.username,
        password: req.body.password,
      });
      if (isAdmin.length > 0) {
        return res.status(200).json({
          status: true,
        });
      } else {
        return res.status(400).json({
          status: false,
        });
      }
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false,
      });
    }
  } catch (e) {
    console.log('error: ', e);
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false,
    });
  }
});

app.post('/addLoginAdmin', async (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {
      const isAdmin = await Admin.create({
        username: req.body.username,
        password: req.body.password,
      });
      if (isAdmin) {
        return res.status(200).json({
          status: true,
        });
      } else {
        return res.status(400).json({
          status: false,
        });
      }
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false,
      });
    }
  } catch (e) {
    console.log('error: ', e);
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false,
    });
  }
});

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const data = await Contact.create({ name, email, message });
    res.json({ status: 201, message: 'form submitted successfully' });
  } catch (error) {
    res.status(400).json({ error });
  }
});

/* Api to add Employee */
app.post('/addEmployee', (req, res) => {
  try {
    if (
      req.body.employeeID &&
      req.body.employeeName &&
      req.body.employeeSalary
    ) {
      const new_employee = new Employee({
        ID: req.body.employeeID,
        Name: req.body.employeeName,
        Salary: req.body.employeeSalary,
      });

      const data = new_employee.save();
      res.status(200).json({
        status: true,
        title: 'Employee added successfully.',
      });
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameters first!',
        status: false,
      });
    }
  } catch (e) {
    console.log('e', e);
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false,
    });
  }
});

app.get('/Employees', async (req, res) => {
  try {
    const data = await Employee.find();
    res.status(200).json(data);
  } catch (e) {
    console.log('e', e);
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false,
    });
  }
});

/* Api to update Employee */
app.post('/update-employee', (req, res) => {
  try {
    if (
      req.files &&
      req.body &&
      req.body.ID &&
      req.body.Name &&
      req.body.Salary
    ) {
      employee.findById(req.body.id, (err, new_employee) => {
        if (req.body.ID) {
          new_employee.ID = req.body.ID;
        }
        if (req.body.Name) {
          new_employee.Name = req.body.Name;
        }
        if (req.body.Salary) {
          new_employee.Salary = req.body.Salary;
        }
        new_employee.save((err, data) => {
          if (err) {
            res.status(400).json({
              errorMessage: err,
              status: false,
            });
          } else {
            res.status(200).json({
              status: true,
              title: 'Employee updated.',
            });
          }
        });
      });
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false,
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false,
    });
  }
});

/* Api to delete Employee */
app.post('/deleteEmployee', async (req, res) => {
  const employeeID = req.body.employeeID;
  try {
    const data = await Employee.findOneAndDelete({
      ID: req.body.employeeID,
    });
    return res.status(200).json({ success: true, data });
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false,
    });
  }
});

app.get('/', (req, res) => {
  const htmlFilePath = path.join(__dirname, 'Login.html');
  res.sendFile(htmlFilePath);
});

app.get('/guest', (req, res) => {
  const htmlFilePath = path.join(__dirname, 'Guest.html');
  res.sendFile(htmlFilePath);
});

app.get('/admin', (req, res) => {
  const htmlFilePath = path.join(__dirname, 'Admin.html');
  res.sendFile(htmlFilePath);
});

// Start the server
app.listen(process.env.PORT || 8080, () => {
  console.log('Server is running on port 8080');
});
