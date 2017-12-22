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


router.get('/render_pagos', function(req, res, next){
    req.getConnection(function(err, connection){
        connection.query("SELECT pago.*, cdc.nombre FROM pago LEFT JOIN cdc ON pago.idcdc = cdc.idcdc ORDER BY pago.fecha DESC", function(err, pagos){
            if(err){console.log("Error Selecting : %s", err);}
            connection.query("SELECT idcdc,nombre FROM cdc",function(err,cdc){
                if(err){console.log("Error Selecting : %s", err);}
                 res.render("pagos/pagos", {data: pagos, titulo: "Pago",cdc:cdc});
            });
        }); 
    });
});
router.get('/pagoscsv_forged', function(req, res, next){
        var fs = require('fs')
        var parse = require('csv-parse');

        var parser = parse(
            function(err,rows){
                if(err) throw err;
                var aux = [];
                var mat_list = [];
                var ing_list = [];
                var egreso_list = [];
                var fecha,monto,tipo;
                for(var i=1;i<rows.length;i++){
                    if(rows[i][7] == "C"){
                        tipo = "egreso";
                    } else if( rows[i][7] == "A"){
                        tipo = "ingreso";
                    }
                    aux.push(rows[i][7]);
                    monto = Math.abs(parseInt(rows[i][0].replace(/\./g,"")));
                    fecha = rows[i][3].split("/");
                    fecha = new Date(fecha[2],fecha[1],fecha[0]);
                    mat_list.push([rows[i][1],fecha,fecha,tipo,monto,1]);
                }
                req.getConnection(function(err,connection){
                    if(err) throw err;
                    connection.query("INSERT INTO pago (`detalle`,`fecha`,`fecha_p`,`tipo`,`monto`,`idcdc`) VALUES ?",[mat_list],function(err,rows){
                        if(err) {
                            throw err;
                        }
                        console.log(rows.insertId + 1);
                        console.log("aff: " + rows.affectedRows);
                        console.log("f_len: " + aux.length);
                        for(var j = 0;j<aux.length;j++){
                            if(aux[j] == "C"){
                                egreso_list.push([rows.insertId + j,1,mat_list[j][0],mat_list[j][1],"pagado",mat_list[j][4]]);
                            } else if(aux[j] == "A"){
                                ing_list.push([rows.insertId + j,1,mat_list[j][0],mat_list[j][1],"pagado",mat_list[j][4]]);
                            }
                        }
                        connection.query("INSERT INTO ingreso (`idpago`,`idcdc`,`detalle`,`fecha`,`tipo`,`monto`) VALUES ?",[ing_list],function(err,forgeds){
                            if(err) throw err;
                            connection.query("INSERT INTO egreso (`idpago`,`idcdc`,`detalle`,`fecha`,`tipo`,`monto`) VALUES ?",[egreso_list],function(err,forgeds){
                                if(err) throw err;
                                res.redirect('/');
                            });
                        });
                    })
                });
            });
        var input = fs.createReadStream('cartola.csv');
        input.pipe(parser);

        /*input.pipe(parse(function(err, rows){
            if(err) throw err;
            console.log(rows);
        }));*/

});


router.get('/render_carousel', function(req, res, next){
    req.getConnection(function(err, connection){
        connection.query("SELECT pago.*,cdc.nombre FROM pago LEFT JOIN cdc ON pago.idcdc = cdc.idcdc WHERE pago.fecha_p > NOW() GROUP BY pago.idpago ORDER BY pago.fecha ASC", function(err, pagos){
            if(err){console.log("Error Selecting : %s", err);}
            res.render("pagos/carousel_calendario", {data: pagos});
        });
    });
});




module.exports = router;