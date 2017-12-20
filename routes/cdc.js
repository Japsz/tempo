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
        connection.query("SELECT cdc.*,SUM(egreso.monto) as e_total,SUM(ingreso.monto) as i_total FROM cdc LEFT JOIN egreso ON egreso.idcdc = cdc.idcdc" +
            " LEFT JOIN ingreso ON ingreso.idcdc = cdc.idcdc GROUP BY cdc.idcdc",function(err,rows){
            if(err) throw err;
            res.render('cdc/cc_view',{data: rows});
        });
    });
});
router.post('/save',function(req,res,next){
    var input = JSON.parse(JSON.stringify(req.body));
    console.log(input);
    eq.getConnection(function(err,connection){
        if(err) throw err;
        connection.query("INSERT INTO cdc SET ?",input,function(err,rows){
            if(err) throw err;
            res.redirect('/cdc');
        });
    });
});


function js_yyyy_mm_dd_hh_mm_ss () {
  now = new Date();
  year = "" + now.getFullYear();
  month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
  day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
  hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
  minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
  second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
  return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}

router.post('/save_pay',function(req,res,next){
    var input = JSON.parse(JSON.stringify(req.body));
    input.tipo = input.tipo.toLowerCase();
    var tipo = input.tipo;
    req.getConnection(function(err,connection){
        if(err) throw err;
        if(input.tipo == 'egreso'){
            console.log(input);
            input.fechacreacion = js_yyyy_mm_dd_hh_mm_ss();
            delete input.metodopago;
            delete input.tipo;
            connection.query("INSERT INTO "+tipo+" SET ?", input, function(err, rows){
                if(err){console.log("Error Selecting : %s", err);}
                res.redirect('/cdc/mycdc_gastos');
            });
        }
        else{
            if(input.fac == "1"){
                delete input.fac;
                input.fecha_p = input.fecha;
                connection.query("INSERT INTO pago SET ?", input, function(err, pago){
                    if(err){console.log("Error Selecting : %s", err);}
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
                console.log(cdc);
                console.log(egresos);
                res.render('cdc/mycdc',{cdc: cdc[0],egreso:egresos});
            });
        });
    });
});

router.get("/show/:idcdc",function(req,res,next){
    req.getConnection(function(err,connection){
        if(err) throw err;
        connection.query("SELECT cdc.*,SUM(egreso.monto) as e_total,SUM(ingreso.monto) as i_total FROM cdc LEFT JOIN egreso ON egreso.idcdc = cdc.idcdc" +
            " LEFT JOIN ingreso ON ingreso.idcdc = cdc.idcdc WhERE cdc.idcdc = ? GROUP BY cdc.idcdc",req.params.idcdc,function(err,cdc){
            if(err) throw err;
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