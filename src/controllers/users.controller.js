import {User } from "../models/user.js";
import { Task } from "../models/task.js";
import logger from '../logs/logger.js';
import { Status } from "../constants/index.js";

async function getUsers(req, res) {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'password', 'status'],
            order: [['id', 'DESC']],
            where: {
                status: Status.ACTIVE
            }
        })
        res.json(users);
    } catch (error) {
        logger.error('Error getUsers:'+ error )
        res.status(500).json({
            message: 'server error'
        })
    }
}

async function createUser(req, res) {
    try {
        const { username, password } = req.body;
        const user = await User.create({ username, password });
        res.json(user);
    } catch (error) {
        logger.error(`Error createUser: ${error.message}`);
        res.status(400).json({ message: 'Error al crear usuario' });
    }
}

async function getUser(req, res) {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: ['username', 'status']
        });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        logger.error(`Error getUser: ${error.message}`);
        res.status(500).json({ message: 'Error al obtener usuario' });
    }
}

async function updateUser(req, res) {
    const { id } = req.params;
    const { username, password } = req.body;
    try {
        if (!username || !password)
            return res
                .status(400)
                .json({ message: 'Debe enviar los datos correctos' });
        const user = await User.update(
            {
                username,
                password,
            },
            {
                where: { id },
            },
        );
        res.json(user)
    } catch (error) {
        logger.error(`Error getUser: ${error.message}`);
        res.status(500).json({ message: 'Error al actualizar usuario' });
    }
}

async function activateInactivate(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    try {
        if (!status)return res.status(400).json({ message: 'Status es obligatorio' });
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (user.status === status){
            return res
                .status(400)
                .json({ message: 'El usuario ya tiene el status deseado' });
        }

        user.status = status;
        await user.save();
        res.json(user);
    } catch (error) {
        logger.error(`Error activateInactivate: ${error.message}`);
        res.status(500).json({ message: 'Error al activar/desactivar usuario' });
    }
}

async function deleteUser(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        await user.destroy();
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        logger.error(`Error deleteUser: ${error.message}`);
        res.status(500).json({ message: 'Error al eliminar usuario' });
    }
}

// async function getTasks(req, res) {
//     const {id} = req.params
//     try {
//         const user = await User.findOne({
//             attributes: ['username'],
//             include: [{
//                 model: Task,
//                 attributes: ['name', 'done'],
//                 // where: [{
//                 //     done: true
//                 // }]
//             }],
//             where: {id}
//         })
//         res.json(user)
//     } catch (error) {
//         logger.error('Error getTasksUsers: ' + error)
//         res.status(500).json({message: 'Server error'})
//     }
// }

async function getTasks(req, res) {
    try {
        const user = await User.findAll({
            attributes: ['username'],
            include: [{
                model: Task,
                attributes: ['name', 'done'],
            }],
        })
        res.json(user);
    } catch (error) {
        logger.error(`Error getTasksUsers: ${error.message}`);
        res.status(500).json({ message: 'Error al obtener tareas todos usuario' });
    }
}


export default {
    getUsers,
    createUser,
    getUser,
    updateUser,
    activateInactivate,
    deleteUser,
    getTasks,
    
}