const { Sequelize } = require('sequelize');




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

const Ticket = sequelize.define('Ticket', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userEmail: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  priority: {
    type: Sequelize.STRING,
    allowNull: false
  },
  issueKey: {
    type: Sequelize.STRING,
    allowNull: false
  },
  link: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  status: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: 'Open'
  }
}, {
  tableName: 'tickets',
  timestamps: false
});

module.exports = Ticket;


Collection.belongsTo(User, { foreignKey: 'userid' });
User.hasMany(Collection, { foreignKey: 'userid' });

Item.belongsTo(Collection, { foreignKey: 'collectionid' });
Collection.hasMany(Item, { foreignKey: 'collectionid' });

Ticket.belongsTo(User, { foreignKey: 'userEmail', targetKey: 'email' });
User.hasMany(Ticket, { foreignKey: 'userEmail', sourceKey: 'email' });

module.exports = {
  sequelize,
  User,
  Collection,
  Item,
  Ticket,
};