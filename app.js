const express = require('express');
const app = express();
const path = require('path');
// const pool = require('./config/dbConfig');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const jwt = require('jsonwebtoken');
const config = require('./config/config')
const secretKey = config.secretKey;
const {authMiddleware, isAdminMiddleware} = require('./middleware/authMiddleware');
const isProfileOwner = require('./middleware/isProfileOwner');
const Fuse = require('./config/fuse');
module.exports = isAdminMiddleware;

const fs = require('fs');
const {Collection} = require('./config/bd')
const {Item} = require('./config/bd')
const {User} = require('./config/bd')
const {ItemField}= require('./config/bd')
const { sequelize } = require('./config/bd');
const { Sequelize } = require('sequelize');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
    console.error(err.stack);
    fs.appendFile('error.log', err.stack + '\n', (error) => {
        if (error) {
            console.error('Ошибка записи в лог:', error);
        }
    });
    res.status(500).send('Что-то пошло не так!');
});
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '/mainPage/mainPage.html'));
});
// function searchItemsByTag(tag, items) {
//     const fuse = new Fuse(items, {
//         keys: ['tags'] // Определите ключи, по которым будет выполняться поиск
//     });
//     return fuse.search(tag);
// }


app.get('/api/search', async (req, res) => {
    const { tag, name } = req.query;

    // Проверка, что хотя бы один из параметров задан
    if (!tag && !name) {
        return res.status(400).json({ error: 'Tag or name parameter is missing' });
    }

    try {
        let whereCondition = {};

        if (tag && name) {
            // Если указаны оба параметра, выполнять поиск по обоим
            whereCondition = {
                [Sequelize.Op.or]: [
                    { tags: { [Sequelize.Op.like]: `%${tag}%` } },
                    { name: { [Sequelize.Op.like]: `%${name}%` } }
                ]
            };
        } else if (tag) {
            // Если указан только тег
            whereCondition = { tags: { [Sequelize.Op.like]: `%${tag}%` } };
        } else if  (name) {
            // Если указано только имя
            whereCondition = { name: { [Sequelize.Op.like]: `%${name}%` } };
        
        }
        // Поиск элементов с учетом заданных условий
        const items = await Item.findAll({
            where: whereCondition
        });

        if (!items.length) {
            return res.status(404).json({ error: 'No items found for the tag or name' });
        }

        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/tags', async (req, res) => {
    try {
      const items = await Item.findAll();
      const tags = items.map(item => ({
        id: item.id,
        name: item.name,
        tags: item.tags.split(',') // предположим, что теги хранятся как строка, разделенная запятыми
      }));
      res.json(tags);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch tags' });
    }
  });

  app.get('/api/items', async (req, res) => {
    const tag = req.query.tag; // Получаем значение параметра tag из запроса
    if (!tag) {
        return res.status(400).json({ error: 'Tag parameter is missing' });
    }

    try {
        // Ищем элементы в базе данных, у которых есть указанный тег
        const items = await Item.findAll({
            where: {
                tags: {
                    [Sequelize.Op.like]: `%${tag}%` // Поиск по частичному совпадению тега
                }
            }
        });

        if (!items.length) {
            return res.status(404).json({ error: 'No items found for the tag' });
        }

        // Возвращаем найденные элементы в виде JSON
        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/items/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        const item = await Item.findByPk(itemId);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        await item.destroy();
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.delete('/items/:id', async (req, res) => {
    const itemId = req.params.id;

    try {
        const item = await Item.findByPk(itemId);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        await item.destroy();

        res.status(204).end(); // Возвращаем успешный статус без содержимого
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/collections/byId/:id', async (req, res) => {
    const collectionId = parseInt(req.params.id);

    try {
        const collection = await Collection.findByPk(collectionId);

        if (collection) {
            res.json(collection);
        } else {
            res.status(404).send('Collection not found');
        }
    } catch (error) {
        console.error('Error fetching collection:', error);
        res.status(500).send('Internal Server Error');
    }
})

app.get('/items/all/:collectionid', async (req, res) => {
    try {
        // Получаем ID коллекции из параметров запроса
        const collectionId = req.params.collectionid;

        // Запрос к базе данных для получения всех элементов из указанной коллекции
        const allItems = await Item.findAll({ where: { collectionid: collectionId } });

        // Отправляем все элементы в формате JSON
        res.json(allItems);
    } catch (error) {
        console.error('Ошибка при получении всех элементов из коллекции:', error);
        res.status(500).json({ error: 'Ошибка при получении всех элементов из коллекции' });
    }
});


app.get('/collections/:collectionId/itemCount', async (req, res) => {
    try {
        const { collectionId } = req.params;

        // Подсчитываем количество элементов в коллекции с указанным ID
        const itemCount = await Item.count({ where: { collectionId } });

        res.json({ collectionId, itemCount });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.get('/users', async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
      console.log(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
// Маршруты регистрации и авторизации
app.post('/users/register', async (req, res) => {
    console.log('Request body:', req.body)
    const { username, password, email,  isadmin} = req.body;
    console.log('Extracted data:', username, password, email, isadmin);
    try {
        // const query = 'INSERT INTO users (username, password, email, isadmin) VALUES (, $2, $3, $4) RETURNING *';
        const query = 'INSERT INTO users (username, password, email, isadmin) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [username, password, email, isadmin]; // Добавляем значение email в запрос
        console.log(values)
        const result = await sequelize.query(query, {bind:values, type:sequelize.QueryTypes.INSERT});
        res.status(201).json(result[0]);
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

app.post('/items/add', authMiddleware, async (req, res) => {
    try {
        const { collectionid, name, tags,props } = req.body;
        const userId = req.user.userId;

        // Логирование данных запроса
        console.log('Тело запроса:', req.body);

        if (!collectionid) {
            console.error('Ошибка: collectionid is null');
            return res.status(400).json({ error: 'collectionid cannot be null' });
        }
        const tagsString = JSON.stringify(tags);
        const propsString = JSON.stringify(props);
        const newItem = await Item.create({
            userId,
            collectionid,
            name,
            tags:tagsString,
            props:propsString,
        });

        console.log('Созданный элемент:', newItem);
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Ошибка при добавлении элемента:', error);
        res.status(500).json({ error: 'Error adding item' });
    }
});




app.put('/items/:itemId', async (req, res) => {
    const { itemId } = req.params;
    const { name, tags,props} = req.body;
    

    try {
        const item = await Item.findByPk(itemId);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        console.log('Before update:', { name, tags }); // Логирование значений до обновления

        item.name = name || item.name;
        item.tags = tags || item.tags;
        item.props = props || item.props;

        await item.save();
        
        console.log('After update:', item); // Логирование объекта после обновления
        res.json({ message: 'Item updated successfully' });
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ error: 'Error updating item' });
    }
});




app.post('/collections/add', authMiddleware, async (req, res) => {
    try {
        const { name, description, category, image, fields } = req.body;
        const userid = req.user.userId;

        console.log('Полученные данные:', req.body);

        const newCollection = await Collection.create({
            userid,
            name,
            description,
            category,
            image
        });

        // Если у вас есть таблица для хранения полей коллекции, например CollectionField
        if (fields && typeof fields === 'object') {
            for (const [fieldName, fieldType] of Object.entries(fields)) {
            await ItemField.create({
                    collectionId: newCollection.id,
                    fieldName: fieldName,
                    fieldType: fieldType
                });
            }
        }

        res.status(201).json(newCollection);
    } catch (error) {
        console.error('Ошибка при добавлении коллекции:', error);
        res.status(500).json({ error: 'Ошибка при добавлении коллекции' });
    }
});

app.get('/users/status', authMiddleware, (req, res) => {
    res.json({ isAuthenticated: true });
});

app.get('/items/latest', async (req, res) => {
    try {
        // Запрос к базе данных для получения последних элементов
        const latestItems = await Item.findAll({
            order: [['id', 'DESC']], // Сортируем по убыванию id, чтобы получить последние добавленные элементы
            limit: 5 // Ограничиваем количество возвращаемых элементов до 5
        });

        // Отправляем последние элементы в формате JSON
        res.json(latestItems);
    } catch (error) {
        console.error('Ошибка при получении последних элементов:', error);
        res.status(500).json({ error: 'Ошибка при получении последних элементов' });
    }
});

app.get('/collections/top', async (req, res) => {
    try {
        const topCollections = await Collection.findAll({
            attributes: ['id', 'name', 'description', 'category'],
            include: [{
                model: Item,
                attributes: [],
            }],
                    group: ['Collection.id'],
            order: [[sequelize.literal('COUNT("Items"."id")'), 'DESC']], // Обратите внимание на использование имени модели "Items"
            limit: 3,
            subQuery: false
        });

        // Проходим по каждой коллекции и добавляем поле с количеством элементов
        const topCollectionsWithItemCount = await Promise.all(topCollections.map(async collection => {
            const itemCount = await Item.count({ where: { collectionid: collection.id } }); // Замените collectionId на collectionid
            return { ...collection.toJSON(), itemCount };
        }));

        res.json(topCollectionsWithItemCount);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/collections', authMiddleware, async (req, res) => {
    try {
      console.log('Request User:', req.user);
  
      if (!req.user || !req.user.userId) {
        return res.status(400).json({ error: 'User ID not found in request' });
      }
  
      const userId = req.user.userId;
  
      // Используем экземпляр sequelize для выполнения запроса к базе данных
      const collections = await Collection.findAll({
        where: { userid: userId }
      });
  
      res.json(collections);
    } catch (error) {
      console.error('Error fetching collections:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/collections/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const collection = await Collection.findByPk(id);
        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }
        res.json(collection);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching collection details' });
    }
});

app.delete('/collections/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const collection = await Collection.findByPk(id);
        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }

        await collection.destroy();
        res.json({ message: 'Collection deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting collection' });
    }
});
app.delete('/admin/users/:userId', authMiddleware,  async (req, res) => {
    const {userId} = req.params;
    try {
        
        await User.destroy({ where: { id: userId } });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/users/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Находим пользователя в базе данных по электронной почте
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await sequelize.query(query, {bind:[email],type:sequelize.QueryTypes.SELECT});
        console.log(result)
        if (result.length === 0) {
            return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
        }

        const user = result[0];

        // Проверяем, совпадает ли введенный пароль с паролем в базе данных
        if (password !== user.password) {
            return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
        }

        // Создаем JWT токен
        const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });

        // Отправляем токен клиенту вместе с успешным ответом
        res.status(200).json({ token, isAuthenticated: true, redirectUrl: '/html/mainPage.html' });
    } catch (error) {
        console.error('Ошибка при входе пользователя:', error);
        res.status(500).json({ message: 'Ошибка при входе пользователя' });
    }
});



app.get('/users/profile', authMiddleware, async (req, res) => {
    try {
      // Для примера, возвращаем информацию о профиле пользователя
      res.json({ userId: req.userData.userId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  app.get('/users/check-auth', authMiddleware, (req, res) => {
    res.status(200).json({ isAuthenticated: true });
});
// Маршруты пользователей
app.use('/users', userRoutes);

app.delete('/users/delete/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);

    try {
        // Выполнение SQL-запроса для удаления пользователя из базы данных
        const result = await sequelize.query('DELETE FROM users WHERE id = $1', {bind:[userId],type:sequelize.QueryTypes.DELETE});
        
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Пользователь успешно удален' });
        } else {
            res.status(404).json({ message: 'Пользователь не найден' });
        }
    } catch (error) {
        console.error('Ошибка при удалении пользователя:', error);
        res.status(500).json({ message: 'Ошибка при удалении пользователя' });
    }
});

app.put('/collections/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, category, image } = req.body;

    try {
        const collection = await Collection.findByPk(id);
        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }

        collection.name = name || collection.name;
        collection.description = description || collection.description;
        collection.category = category || collection.category;
        collection.image = image || collection.image;

        await collection.save();
        res.json({ message: 'Collection updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating collection' });
    }
});


app.put('/users/update_information/:userId',authMiddleware,isProfileOwner, async (req, res) => {
    const userId = parseInt(req.params.userId);
    const { username, email } = req.body;

    try {
        // Проверяем, были ли отправлены имя пользователя и/или адрес электронной почты в теле запроса
        if (!username && !email) {
            return res.status(400).json({ message: 'Не указаны поля для обновления' });
        }

        // Формируем SQL-запрос на основе того, какие поля были отправлены в теле запроса
        let updateFields = [];
        let values = [];

        if (username) {
            updateFields.push('username = $1');
            values.push(username);
        }

        if (email) {
            updateFields.push('email = $2');
            values.push(email);
        }

        const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${values.length + 1}`;
        values.push(userId);

        // Выполняем SQL-запрос для обновления информации о пользователе
        const result = await sequelize.query(updateQuery, {bind:values, type:sequelize.QueryTypes.UPDATE});
        
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Информация о пользователе успешно обновлена' });
        } else {
            res.status(404).json({ message: 'Пользователь не найден' });
        }
    } catch (error) {
        console.error('Ошибка при обновлении информации о пользователе:', error);
        res.status(500).json({ message: 'Ошибка при обновлении информации о пользователе' });
    }
});
app.put('/users/update-password', authMiddleware,isProfileOwner, async (req, res) => {
    const userId = req.userData.userId;
    const { oldPassword, newPassword } = req.body;

    try {
        // Получаем текущий пароль пользователя из базы данных
        const userQuery = 'SELECT password FROM users WHERE id = $1';
        const userResult = await sequelize.query(userQuery, {bind:[userId],type:sequelize.QueryTypes.SELECT});

        if (userResult.length === 0) {
            return res.status(404).json({ error: 'User Not Found', message: 'Пользователь не найден' });
        }

        const currentPassword = userResult[0].password;

        // Проверяем, совпадает ли текущий пароль с введенным пользователем старым паролем
        if (oldPassword !== currentPassword) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Неверный старый пароль' });
        }

        // Обновляем пароль
        const updateQuery = 'UPDATE users SET password = $1 WHERE id = $2';
        await sequelize.query(updateQuery, {bind:[newPassword, userId],type:sequelize.QueryTypes.UPATE});

        res.status(200).json({ message: 'Пароль успешно обновлен' });
    } catch (error) {
        console.error('Ошибка при обновлении пароля:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/users/logout', authMiddleware, (req, res) => {
    // Допустим, что при выходе из системы вы хотите просто удалить токен из заголовка Authorization
    res.setHeader('Authorization', '');
    res.status(200).json({ message: 'Выход из системы успешно выполнен' });
});

app.get('/admin/users', authMiddleware,  async (req, res) => {
    try {    
        const users = await User.findAll();
        res.json(users);
        
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.put('/admin/users/:userId/block', authMiddleware,  async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.blocked = true;
        await user.save();
        res.json(user);
    } catch (error) {
        console.error('Error blocking user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/admin/users/:userId/unblock', authMiddleware,  async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.blocked = false;
        await user.save();
        res.json(user);
    } catch (error) {
        console.error('Error unblocking user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.put('/admin/users/:userId/add-admin', authMiddleware,  async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.isAdmin = true;
        await user.save();
        res.json(user);
    } catch (error) {
        console.error('Error adding user to admins:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/admin/users/:userId/remove-admin', authMiddleware,  async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.isAdmin = false;
        await user.save();
        res.json(user);
    } catch (error) {
        console.error('Error removing user from admins:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Что-то пошло не так!');
});
// Start server
const PORT = process.env.PORT || 3001;
(async () => {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
      await sequelize.sync();
      app.listen(PORT, () => {
        console.log(`App listening at http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  })();