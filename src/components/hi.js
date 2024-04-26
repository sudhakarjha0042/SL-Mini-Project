const ExcelJS = require('exceljs');

// Create a new workbook and a new worksheet
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Sheet 1');

// Define the headers
const headers = ["Student", "Registered Institution", "Exam Centre Institution", "Branch Name", "Exam Definition", "Event", "Slot", "Course", "Exam Date", "Exam Time", "Session", "Eligibility", "Email ID", "Address", "Contact", "Number"];

// Add the headers to the first row
worksheet.columns = headers.map(header => ({header, key: header}));

// Add some sample data
const sampleData = [
  ["John Doe", "Institution 1", "Centre 1", "Branch 1", "Definition 1", "Event 1", "Slot 1", "Course 1", "2022-01-01", "10:00", "Session 1", "Eligible", "john.doe@example.com", "Address 1", "Contact 1", "Number 1"],
  ["Jane Doe", "Institution 2", "Centre 2", "Branch 2", "Definition 2", "Event 2", "Slot 2", "Course 2", "2022-01-02", "11:00", "Session 2", "Not Eligible", "jane.doe@example.com", "Address 2", "Contact 2", "Number 2"]
];

sampleData.forEach(row => worksheet.addRow(row));

// Save the workbook as a .xlsx file
workbook.xlsx.writeFile('sample.xlsx')
    .then(() => console.log('File is written'));