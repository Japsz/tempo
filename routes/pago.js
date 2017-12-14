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

router.get('/render_egresos', function(req, res, next){
    req.getConnection(function(err, connection){
        connection.query("SELECT egreso.*,cdc.nombre FROM egreso LEFT JOIN cdc ON egreso.idcdc=cdc.idcdc ORDER BY egreso.fecha DESC", function(err, egresos){
            if(err){console.log("Error Selecting : %s", err);}
            connection.query("SELECT idcdc,nombre FROM cdc",function(err,cdc){
                if(err){console.log("Error Selecting : %s", err);}
                res.render("pagos/pagos", {data: egresos, titulo:"Egreso",cdc:cdc});

            });
        });
    });
});
router.get('/render_ingresos', function(req, res, next){
    req.getConnection(function(err, connection){
        connection.query("SELECT ingreso.*,cdc.nombre FROM ingreso LEFT JOIN cdc ON ingreso.idcdc=cdc.idcdc ORDER BY ingreso.fecha DESC", function(err, ingresos){
            if(err){console.log("Error Selecting : %s", err);}
            connection.query("SELECT idcdc,nombre FROM cdc",function(err,cdc){
                if(err){console.log("Error Selecting : %s", err);}
                res.render("pagos/pagos", {data: ingresos, titulo: "Ingreso",cdc:cdc});
            });
        });
    });
});


router.get('/render_carousel', function(req, res, next){
    req.getConnection(function(err, connection){
        connection.query("SELECT pago.fecha_p, GROUP_CONCAT(pago.detalle,'@', pago.monto, '@', cdc.nombre,'@',pago.idpago,'@', pago.tipo) as content FROM pago LEFT JOIN cdc ON pago.idcdc = cdc.idcdc GROUP BY pago.fecha_p", function(err, pagos){
            if(err){console.log("Error Selecting : %s", err);}
            res.render("pagos/carousel_calendario", {data: pagos});
        });
    });
});




module.exports = router;