require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { sequelize, Master, Task } = require('./models');

async function seed() {
  try {
    await sequelize.authenticate();
    // Принудительная синхронизация — удаляет существующие таблицы
    await sequelize.sync({ force: true });

    const m1 = await Master.create({ _id: uuidv4(), fio: 'Иванов Иван Иванович' });
    const m2 = await Master.create({ _id: uuidv4(), fio: 'Петров Пётр Петрович' });
    const m3 = await Master.create({ _id: uuidv4(), fio: 'Сидорова Анна Сергеевна' });

    await Task.bulkCreate([
      { _id: uuidv4(), address: 'ул. Ленина, д.1', complexity: 3, masterId: m1._id },
      { _id: uuidv4(), address: 'пр. Мира, д.10', complexity: 5, masterId: m1._id },
      { _id: uuidv4(), address: 'ул. Пушкина, д.5', complexity: 1, masterId: m2._id }
    ]);

    console.log('Seed completed');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
