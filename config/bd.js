const { Sequelize } = require('sequelize');


require('dotenv').config();

// 

const sequelize = new Sequelize(process.env.DB_DATABASE_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOSTNAME,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true, // Требуется использование SSL/TLS
      rejectUnauthorized: false // Отключение проверки сертификата (небезопасно в рабочей среде)
    }
  }
});




const User = sequelize.define('User', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  isadmin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'users',
  timestamps: false
});

const Collection = sequelize.define('Collection', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userid: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  category: {
    type: Sequelize.STRING,
    allowNull: true
  },
  image: {
    type: Sequelize.STRING,
    allowNull: true
  }
}, {
  tableName: 'Collections',
  timestamps: false
});

const Item = sequelize.define('Item', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  collectionid: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Collections',
      key: 'id'
    }
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  tags: {
    type: Sequelize.STRING,
    allowNull: false
  },
  props: {
    type: Sequelize.STRING,
    allowNull: true
  }
}, {
  tableName: 'items',
  timestamps: false
});

// const ItemField = sequelize.define('ItemField', {
//   collectionId: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     references: { model: 'Collections', key: 'id' },
//     onDelete: 'CASCADE'
//   },
//   fieldName: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   fieldType: {
//     type: Sequelize.ENUM('INTEGER', 'STRING', 'TEXT', 'BOOLEAN', 'DATE'),
//     allowNull: false
//   },
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
// }, {
//   timestamps: false
// });

// const FieldValue = sequelize.define('FieldValue', {
//   itemId: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     references: { model: 'items', key: 'id' },
//     onDelete: 'CASCADE'
//   },
//   fieldId: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     references: { model: 'ItemField', key: 'id' },
//     onDelete: 'CASCADE'
//   },
//   value: {
//     type: Sequelize.TEXT
//   }
// }, {
//   timestamps: false
// });

Collection.belongsTo(User, { foreignKey: 'userid' });
User.hasMany(Collection, { foreignKey: 'userid' });

Item.belongsTo(Collection, { foreignKey: 'collectionid' });
Collection.hasMany(Item, { foreignKey: 'collectionid' });

// ItemField.belongsTo(Collection, { foreignKey: 'collectionId' });
// Collection.hasMany(ItemField, { foreignKey: 'collectionId' });

// FieldValue.belongsTo(Item, { foreignKey: 'itemId' });
// Item.hasMany(FieldValue, { foreignKey: 'itemId' });

// FieldValue.belongsTo(ItemField, { foreignKey: 'fieldId' });
// ItemField.hasMany(FieldValue, { foreignKey: 'fieldId' });

module.exports = {
  sequelize,
  User,
  Collection,
  Item,
  // ItemField,
  // FieldValue
};