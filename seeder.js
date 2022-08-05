const fs = require('fs');
const mongoose = require('mongoose');
require('colors');
require('dotenv').config({ path: './config/config.env' });
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const connectDB = require('./config/db');
const User = require('./models/User');
const Review = require('./models/Review');

connectDB();

// Read Json file
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf8')
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf8')
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf8')
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf8')
);

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);
    await Review.create(reviews);
    console.log('data imported successfully\n'.green.inverse);
  } catch (err) {
    console.log(`error: ${err.message}`.red);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('data destroyed successfully\n'.green.inverse);
  } catch (err) {
    console.log(`error: ${err.message}`.red);
  }
};

// if (process.argv[2] === '-i') {
//   importData();
// } else if (process.argv[2] === '-d') {
//   deleteData();
// }

async function seedData() {
  console.log('\n--------------------------');
  await deleteData();
  await importData();
  console.log('--------------------------\n');

  process.exit();
}

seedData();
