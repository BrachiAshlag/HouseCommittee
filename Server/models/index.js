const dbConfig = require('../config/dbConfig');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    },
    define: {
        freezeTableName: false,
        underscored: true,
        timestamps: false
    }
}
)
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize
db.ads_boards = require('./ads_board')(sequelize, DataTypes);
db.apartments = require('./apartments')(sequelize, DataTypes);
db.buildings = require('./buildings')(sequelize, DataTypes);
db.entries = require('./entries')(sequelize, DataTypes);
db.expenses = require('./expenses')(sequelize, DataTypes);
db.expenses_kinds = require('./expenses_kinds')(sequelize, DataTypes);
db.parking_premits = require('./parking_premits')(sequelize, DataTypes);
db.tenants = require('./tenants')(sequelize, DataTypes);
db.payment_forms = require('./payment_forms')(sequelize, DataTypes);
db.tenant_payments = require('./tenant_payments')(sequelize, DataTypes);
db.vote_of_tenants = require('./vote_of_tenant')(sequelize, DataTypes);
db.votes = require('./votes')(sequelize, DataTypes);
db.votes_types = require('./votes_types')(sequelize, DataTypes);
db.faults = require('./faults')(sequelize, DataTypes);
db.monthes = require('./monthes')(sequelize, DataTypes);
db.parks = require('./parks')(sequelize, DataTypes);
db.storages = require('./storages')(sequelize, DataTypes);
db.admins = require('./admins')(sequelize, DataTypes);
db.payments_settings = require('./payment_settings')(sequelize, DataTypes);
db.payment_formes = require('./payment_forms')(sequelize, DataTypes);

db.ads_boards.belongsTo(db.entries, { foreignKey: 'entry_id' });
db.ads_boards.belongsTo(db.buildings, { foreignKey: 'building_id' });
db.entries.belongsTo(db.buildings, { foreignKey: 'building_id' });
db.expenses.belongsTo(db.expenses_kinds, { foreignKey: 'expenses_type_id' });
db.expenses.belongsTo(db.payment_forms, { foreignKey: 'payment_method_id' });
db.apartments.belongsTo(db.entries, { foreignKey: 'entry_id' });
db.tenant_payments.belongsTo(db.payment_forms, { foreignKey: 'payment_form_id' });
db.apartments.belongsTo(db.tenants, { foreignKey: 'res_tenant_id' });
db.buildings.belongsTo(db.payments_settings, { foreignKey: 'payment_setting_id' });

db.sequelize.sync({ force: false })
    .then(() => {
        console.log('yes re-sync done!')
    })
module.exports = db;

