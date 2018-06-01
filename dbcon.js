const mysql = require('mysql2');

var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'us-cdbr-iron-east-05.cleardb.net',
    user            : 'b85fcd0cf4b212',
    password        : 'e1604b7e',
    database        : 'heroku_007b3212e49a50d',
    port            : '3306'
});

module.exports.pool = pool;