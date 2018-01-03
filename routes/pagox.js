var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection  = require('express-myconnection');


router.use(

    connection(mysql, {
        host: '127.0.0.1',
        user: 'admin',
        password: 'tempo123',
        port: 3306,
        database: 'mydb'
    }, 'pool')
);

router.post('/del_pagx', function(req, res, next){
    var input = JSON.parse(JSON.stringify(req.body))
    input.idpagx = parseInt(input.idpagx);
    req.getConnection(function(err, connection){
        connection.query("DELETE FROM "+ input.tipo + " WHERE id" + input.tipo + " = ?",input.idpagx, function(err, egresos){
            if(err){console.log("Error Selecting : %s", err);}
                res.redirect("/pagos/render_carousel");
        });
    });
});
router.post('/update_pagx', function(req, res, next){
    var input = JSON.parse(JSON.stringify(req.body));
    var idpagx = parseInt(input.idpagx);
    var tipo = input.tipo;
    delete input.tipo;
    delete input.idpagx;
    req.getConnection(function(err, connection){
        connection.query("UPDATE "+ tipo + " SET ? WHERE id"+tipo + " = ? ",[input,idpagx], function(err, egresos){
            if(err){console.log("Error Selecting : %s", err);}
            res.redirect("/pagos/render_carousel");
        });
    });
});
router.post('/insert_pagx', function(req, res, next){
    var input = JSON.parse(JSON.stringify(req.body));
    var tipo = input.tipo;
    delete input.tipo;
    req.getConnection(function(err, connection){
        connection.query("INSERT INTO "+ tipo + " SET ?",[input], function(err, egresos){
            if(err){console.log("Error Selecting : %s", err);}
            res.redirect("/pagos/render_carousel");
        });
    });
});
module.exports = router;