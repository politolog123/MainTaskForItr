const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Item, Collection } = require('../config/bd');
const UserController = require('../controllers/userControllers'); // Подключаем модели Item и Collection

// Маршрут для поиска по тексту
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q; // Получаем текст запроса из URL
    // Выполняем поиск в базе данных по тексту запроса
    const items = await Item.findAll({
      where: {
        // Ищем текст запроса в названии или описании айтема
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } }
        ]
      }
    });
    // Отправляем результаты поиска клиенту
    res.json({ items });
  } catch (error) {
    // Если произошла ошибка, отправляем ошибку клиенту
    res.status(500).json({ error: error.message });
  }
});

router.post('/search', async (req, res) => {
  try {
    const query = req.body.query; // Получаем текст запроса из тела запроса
    // Выполняем поиск в базе данных по тексту запроса
    const items = await Item.findAll({
      where: {
        // Ищем текст запроса в названии или описании айтема
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } }
        ]
      }
    });
    // Отправляем результаты поиска клиенту
    res.json({ items });
  } catch (error) {
    // Если произошла ошибка, отправляем ошибку клиенту
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;