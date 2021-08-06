require('dotenv').config();
const getparams=require('../constants/params')
module.exports.knex = require('knex')({
    client: 'pg',
    connection: {
        host: getparams.RDS_DB_HOST_URL,
        user: getparams.RDS_DB_USER,
        password: getparams.RDS_DB_PASSWORD,
        database: getparams.RDS_DB_NAME,
        pool: { min: 3, max: 10 }
    }
});
