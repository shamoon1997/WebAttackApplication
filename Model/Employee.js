var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EmployeeSchema = new Schema({
  ID: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  Salary: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model('Employee', EmployeeSchema);
