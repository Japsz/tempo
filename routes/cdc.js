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
    req.getConnection(function(err,connection){
        if(err) throw err;
        connection.query("INSERT INTO cdc SET ?",input,function(err,rows){
            if(err) throw err;
            res.redirect('/cdc');
        });
    });
});
router.post('/save_pay',function(req,res,next){
    var input = JSON.parse(JSON.stringify(req.body));
    input.tipo = input.tipo.toLowerCase();
    var tipo = input.tipo;
    
    req.getConnection(function(err,connection){
        if(err) throw err;
        connection.query("INSERT INTO pago SET ?", input, function(err, pago){
            if(err){console.log("Error Selecting : %s", err);}
            delete input.tipo;
            input.idpago = pago.insertId;
            connection.query("INSERT INTO " + tipo + " SET ?",input,function(err,rows){
                if(err) throw err;
                res.redirect('/cdc/show/' + input.idcdc);
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