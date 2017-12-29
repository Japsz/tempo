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


router.get('/',function(req,res,next){
    req.getConnection(function(err,connection){
        if(err) throw err;
        connection.query("SELECT cdc.*,SUM(egreso.monto)*COUNT(DISTINCT egreso.idegreso)/count(*) as e_total,SUM(ingreso.monto)*COUNT(DISTINCT ingreso.idingreso)/count(*) as i_total FROM cdc LEFT JOIN egreso ON cdc.idcdc = egreso.idcdc" +
            " LEFT JOIN ingreso ON cdc.idcdc = ingreso.idcdc WHERE cdc.idcdc > 1 GROUP BY cdc.idcdc",function(err,rows){
            if(err) throw err;
            res.render('cdc/cc_view',{data: rows},function(err,html){if(err) console.log(err); res.send(html)});
        });
    });
});
router.post('/save',function(req,res,next){
    var input = JSON.parse(JSON.stringify(req.body));
    console.log(input);
    req.getConnection(function(err,connection){
        if(err) throw err;
        connection.query("INSERT INTO cdc SET ?",input,function(err,rows){
            if(err) throw err;
            res.redirect('/cdc');
        });
    });
});


function js_dateformat () {
  now = new Date();
  year = "" + now.getFullYear();
  month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
  day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
  hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
  minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
  second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
  return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}


router.get('/mycdc_gastos', function(req, res, next){
    req.getConnection(function(err, connection){
        connection.query("SELECT * FROM egreso WHERE idcdc = 1",function(err,egresos){
            if(err) throw err;
            res.render('cdc/mycdc_gastos',{egreso:egresos});
        });
    });
});

router.post('/save_pay',function(req,res,next){
    var input = JSON.parse(JSON.stringify(req.body));
    console.log(input);    
    req.getConnection(function(err,connection){
        if(err) throw err;
        if(input.metodopago){
            console.log("Aqui entra si tiene metodo de pago");
            var arpagos = [];
            var aregresos = [];
            var date = new Date(input.fecha);
            var factor = 0;
            if(input.metodopago == 'mensual'){factor = 60*1000*60*24*30;}   
            else if(input.metodopago == 'anual'){factor = 60*1000*60*24*30*12;}
            for(var k=0; k < input.cant_pagos; k++){
                var a = k+1;     
                arpagos.push([input.idcdc, input.monto, date, date, input.detalle+" (Pago "+a+")", input.tipo]);
                date = new Date(date.getTime() + factor );
            }
            console.log(arpagos);
            connection.query("INSERT INTO pago (idcdc, monto, fecha, fecha_p, detalle, tipo) VALUES ?", [arpagos], function(err, newPagos){
                if(err){console.log("Error Selecting : %s", err);}
                console.log(newPagos);
                var init_id = newPagos.insertId;
                var aff = newPagos.affectedRows;
                var fecha = new Date(input.fecha);
                for(var h=0; h < input.cant_pagos; h++){
                    var num = h+1;
                    aregresos.push([input.idcdc, init_id+h, input.monto, fecha, input.detalle+" (Pago "+num+")", 'no-pagado']);
                    fecha = new Date(fecha.getTime() + factor);
                }
                console.log(aregresos);
                connection.query("INSERT INTO egreso (idcdc, idpago, monto, fecha, detalle, tipo) VALUES ?", [aregresos], 
                    function(err, rows){
                        if(err){console.log("Error Selecting : %s", err);}
                        res.redirect('/cdc/mycdc_gastos');
                });
            });
            
        }
        else{
            if(input.fac == "1"){
                delete input.fac;
                input.fecha_p = input.fecha;
                connection.query("INSERT INTO pago SET ?", input, function(err, pago){
                    if(err){console.log("Error Selecting : %s", err);}
                    var tipo = input.tipo.toLowerCase();
                    delete input.tipo;
                    delete input.n_factura;
                    delete input.fecha_p;
                    input.idpago = pago.insertId;
                    connection.query("INSERT INTO " + tipo + " SET ?",input,function(err,rows){
                        if(err) throw err;
                        res.redirect('/cdc/show/' + input.idcdc);
                    });
                });
            }
            else{
                    var tipo = input.tipo.toLowerCase();
                    delete input.fac;
                    delete input.tipo;
                    delete input.n_factura;
                    input.idpago = null;
                    connection.query("INSERT INTO " + tipo + " SET ?",input,function(err,rows){
                        if(err) throw err;
                        res.redirect('/cdc/show/' + input.idcdc);
                    });  
            }
        }
    });
});



router.get("/mycdc",function(req,res,next){
    req.getConnection(function(err,connection){
        if(err) throw err;
        connection.query("SELECT cdc.*,SUM(egreso.monto) as e_total FROM cdc LEFT JOIN egreso ON egreso.idcdc = cdc.idcdc WHERE cdc.idcdc = 1 GROUP BY cdc.idcdc",function(err,cdc){
            if(err) throw err;
            connection.query("SELECT * FROM egreso WHERE idcdc = 1",function(err,egresos){
                if(err) throw err;
                res.render('cdc/mycdc',{cdc: cdc[0],egreso:egresos});
            });
        });
    });
});

router.get("/show/:idcdc",function(req,res,next){
    req.getConnection(function(err,connection){
        if(err) throw err;
        connection.query("SELECT cdc.*, SUM(egreso.monto)*COUNT(DISTINCT egreso.idegreso)/count(*) as e_total,SUM(ingreso.monto)*COUNT(DISTINCT ingreso.idingreso)/count(*) as i_total FROM cdc LEFT JOIN egreso ON cdc.idcdc = egreso.idcdc" +
            " LEFT JOIN ingreso ON cdc.idcdc = ingreso.idcdc  WHERE cdc.idcdc = ? GROUP BY cdc.idcdc LIMIT 1",req.params.idcdc,function(err,cdc){
            if(err) throw err;
            console.log(cdc);
            connection.query("SELECT * FROM ingreso WHERE idcdc = ?",req.params.idcdc,function(err,ingresos){
                if(err) throw err;
                connection.query("SELECT * FROM egreso WHERE idcdc = ?",req.params.idcdc,function(err,egresos){
                    if(err) throw err;
                    res.render('cdc/show_cdc',{cdc: cdc[0],ingreso:ingresos,egreso:egresos});
                });
            });
        });
    });
});

module.exports = router;