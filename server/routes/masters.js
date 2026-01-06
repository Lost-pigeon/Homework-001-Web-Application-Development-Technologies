const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const { sequelize, Master, Task } = require('../models');

const COMPLEXITY_LIMIT = Number(process.env.COMPLEXITY_LIMIT || 10);

// GET all masters
router.get('/', async (req, res) => {
  try {
    const masters = await Master.findAll({ order: [['createdAt', 'ASC']] });
    res.json(masters);
  } catch (err) {
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

// POST create master
router.post('/', async (req, res) => {
  try {
    const { fio } = req.body;
    if (!fio || typeof fio !== 'string') return res.status(400).json({ error: 'fio required' });
    const id = uuidv4();
    const master = await Master.create({ _id: id, fio });
    res.status(201).json(master);
  } catch (err) {
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

// PUT update master fio
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fio } = req.body;
    if (!fio || typeof fio !== 'string') return res.status(400).json({ error: 'fio required' });
    const [updated] = await Master.update({ fio }, { where: { _id: id } });
    if (!updated) return res.status(404).json({ error: 'master not found' });
    const master = await Master.findByPk(id);
    res.json(master);
  } catch (err) {
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

// DELETE master (cascade tasks due to association)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const master = await Master.findByPk(id);
    if (!master) return res.status(404).json({ error: 'master not found' });
    await master.destroy();
    res.json({ message: 'deleted', master });
  } catch (err) {
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

// GET tasks for master
router.get('/:id/tasks', async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await Task.findAll({ where: { masterId: id }, order: [['createdAt','ASC']] });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

// POST add task to master with complexity limit check (transactional)
router.post('/:id/tasks', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { address, complexity } = req.body;
    if (!address || typeof address !== 'string') {
      await t.rollback(); return res.status(400).json({ error: 'address required' });
    }
    if (typeof complexity !== 'number') {
      await t.rollback(); return res.status(400).json({ error: 'complexity required and must be number' });
    }

    const master = await Master.findByPk(id, { transaction: t });
    if (!master) {
      await t.rollback(); return res.status(404).json({ error: 'master not found' });
    }

    // sum existing complexity of tasks for this master inside transaction
    const currentSum = await Task.sum('complexity', { where: { masterId: id }, transaction: t }) || 0;

    if (currentSum + complexity > COMPLEXITY_LIMIT) {
      await t.rollback();
      return res.status(400).json({
        error: 'complexity_limit_exceeded',
        message: `Assigned complexity would exceed limit (${COMPLEXITY_LIMIT}). Current sum: ${currentSum}. New task: ${complexity}.`
      });
    }

    const task = await Task.create({ _id: uuidv4(), address, complexity, masterId: id }, { transaction: t });
    await t.commit();
    res.status(201).json(task);
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

module.exports = router;
