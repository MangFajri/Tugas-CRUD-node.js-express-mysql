let mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_xi-rpl_27'
});
connection.connect(function(error){
    if(!!error){
        console.log('Error connecting to the database: ');
    } else {    
        console.log('Gacorr bisa');
    }
})

module.exports = connection;