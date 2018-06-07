var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_liuqib',
  password        : '6071',
  database        : 'cs340_liuqib'
});
module.exports.pool = pool;
