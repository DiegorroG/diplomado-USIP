import { Task } from '../models/task.js';
import logger from '../logs/logger.js';

async function getTasks(req, res) {
    const { userId } = req.user;
    try {
        const tasks = await Task.findAll({
            attributes: ['id', 'name', 'done'],
            order: [['name', 'ASC']],
            where: {
                userId,
            },
        });
        res.json(tasks);
    } catch (error) {
        logger.error(`Error getTasks: ${error.message}`);
        res.status(500).json({ message: 'Error server' });
    }
}

async function createTask(req, res) {
    const { userId } = req.user;
    const { name } = req.body;
    try {
        const task = await Task.create({
            name,
            userId,
        });
        res.json(task);
    } catch (error) {
        logger.error(`Error createTask: ${error.message}`);
        res.status(500).json({ message: 'Error server' });
    }
}

async function getTask(req, res) {
    const { userId } = req.user;
    const { id } = req.params;
    try {
        const task = await Task.findOne({
            attributes: ['name', 'done'],
            where: {
                id,
                userId,
            },
        });
        res.json(task);
    } catch (error) {
        logger.error(`Error getTask: ${error.message}`);
        res.status(500).json({ message: 'Error server' });
    }
}

async function updateTask(req, res) {
    const { userId } = req.user;
    const { id } = req.params;
    const { name } = req.body;
    try {
        const task = await Task.update({ name }, { where: { id, userId } });

        if (task[0] === 0)
            return res.status(404).json({ message: 'Tarea no encontrada' });

        res.json(task);
    } catch (error) {
        logger.error(`Error updateTask: ${error.message}`);
        res.status(500).json({ message: 'Error server' });
    }
}

async function taskDone(req, res) {
    const { userId } = req.user;
    const { id } = req.params;
    const { done } = req.body;

    try {
        const task = await Task.update({ done }, { where: { id, userId } });

        if (task[0] === 0)
            return res.status(404).json({ message: 'Tarea no encontrada' });
        
        res.json(task);
    } catch (error) {
        logger.error(`Error taskDone: ${error.message}`);
        res.status(500).json({ message: 'Error server' });
    }
}

async function deleteTask(req, res) {
    const { userId } = req.user;
    const { id } = req.params;
    try {
        const task = await Task.destroy({ where: { id, userId } });

        if (task === 0)
            return res.status(404).json({ message: 'Tarea no encontrada' });

        res.json(task);
    } catch (error) {
        logger.error(`Error deleteTask: ${error.message}`);
        res.status(500).json({ message: 'Error server' });
    }
}

export default {
    getTasks,
    createTask,
    getTask,
    updateTask,
    taskDone,
    deleteTask,
}