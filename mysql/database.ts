import mysql from 'mysql2';
const {database} = require('./keys');
const pool = mysql.createPool(database);
const {promisify} = require('util');

pool.getConnection( function(err,conn){
    if(err){
        console.log(err);
    }
    if(conn) conn.release();
    console.log('\x1b[32m%s\x1b[0m','✓ The DB is connected successfully');
    return;
});

//convert to promiseto has callback
pool.query = promisify(pool.query);
module.exports = pool;