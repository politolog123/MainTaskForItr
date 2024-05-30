const { Op } = require('sequelize');
const { Item } = require('../config/bd');




exports.searchItems = async (req, res) => {
  try {
    const query = req.query.q; 

    const items = await Item.findAll({
      where: {

        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } }
        ]
      }
    });

    res.json({ items });
  } catch (error) {

    res.status(500).json({ error: error.message });
  }
};