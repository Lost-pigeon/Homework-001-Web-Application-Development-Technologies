require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { sequelize } = require('./models'); // инициализация sequelize
const mastersRouter = require('./routes/masters');
const tasksRouter = require('./routes/tasks');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// sync DB and then start server
async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); 
    console.log('MySQL connected and models synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Unable to start server:', err);
    process.exit(1);
  }
}

app.use('/api/masters', mastersRouter);
app.use('/api/tasks', tasksRouter);

app.get('/api/config', (req, res) => {
  res.json({
    complexityLevels: [
      { label: 'Low', value: 1 },
      { label: 'Medium', value: 3 },
      { label: 'High', value: 5 }
    ],
    complexityLimit: Number(process.env.COMPLEXITY_LIMIT || 10)
  });
});

start();
