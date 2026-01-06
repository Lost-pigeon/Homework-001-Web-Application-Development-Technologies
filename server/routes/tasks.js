const express = require('express');
const router = express.Router();
const { sequelize, Master, Task } = require('../models');

const COMPLEXITY_LIMIT = Number(process.env.COMPLEXITY_LIMIT || 10);

// GET task by id
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'task not found' });
    await task.destroy();
    res.json({ message: 'deleted', task });
  } catch (err) {
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

// PUT update task (address, complexity, or reassign masterId) with transactional checks
router.put('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { address, complexity, masterId } = req.body;

    const task = await Task.findByPk(id, { transaction: t });
    if (!task) {
      await t.rollback(); return res.status(404).json({ error: 'task not found' });
    }

    // if reassigning to new master
    if (masterId && masterId !== task.masterId) {
      const targetMaster = await Master.findByPk(masterId, { transaction: t });
      if (!targetMaster) {
        await t.rollback(); return res.status(404).json({ error: 'target master not found' });
      }

      // sum complexity of target master
      const targetSum = await Task.sum('complexity', { where: { masterId }, transaction: t }) || 0;
      const taskComplexity = (typeof complexity === 'number') ? complexity : task.complexity;

      if (targetSum + taskComplexity > COMPLEXITY_LIMIT) {
        await t.rollback();
        return res.status(400).json({
          error: 'complexity_limit_exceeded',
          message: `Reassignment would exceed limit (${COMPLEXITY_LIMIT}). Target sum: ${targetSum}. Task complexity: ${taskComplexity}.`
        });
      }

      task.masterId = masterId;
    }

    if (address) task.address = address;
    if (typeof complexity === 'number') {
      // If complexity changes but master stays same, check limit for current master
      if (!masterId || masterId === task.masterId) {
        const sumOther = await Task.sum('complexity', { where: { masterId: task.masterId }, transaction: t }) || 0;
        // sumOther includes current task; compute newSum = sumOther - old + new
        const newSum = sumOther - task.complexity + complexity;
        if (newSum > COMPLEXITY_LIMIT) {
          await t.rollback();
          return res.status(400).json({
            error: 'complexity_limit_exceeded',
            message: `Updating complexity would exceed limit (${COMPLEXITY_LIMIT}). New sum: ${newSum}.`
          });
        }
      }
      task.complexity = complexity;
    }

    await task.save({ transaction: t });
    await t.commit();
    res.json(task);
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: 'internal_error', message: err.message });
  }
});

module.exports = router;
