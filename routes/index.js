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
/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.session.userDatos){
  		res.render('main/index', { title: 'Bienvenido' });	
  	}
  	else{
  		res.redirect('/login');
  	}
});



router.get('/login', function(req, res, next) {
  	if(req.session.userDatos){
  		res.render('main/index', { title: 'Bienvenido' });	
  	}
  	else{
  		res.render('login');
  	}
});
router.post('/login_in', function(req, res, next){
    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function(err, connection){
    	connection.query("SELECT * FROM user WHERE nombreuser = ? AND pass = ?", [input.nombreuser, input.pass],
    		function(err, user){
    			if(err){
    				console.log("Error Selecting : %s", err);
    				res.redirect('/bad_login');
    			}
    			else{
    				if(user.length > 0){
    					req.session.userDatos = user;
    				  	res.redirect('/');
					}
    				else{
	    				res.redirect('/bad_login');
    				}
    			}
    		});
    });  
});

router.get('/bad_login', function(req, res, next){
	res.render('bad_login');
});
router.get('/login_out', function(req, res, next){
	delete req.session.userDatos;
	res.redirect('/login');
});

router.get('/render_section/:id_frame', function(req, res, next){
	var id = req.params.id_frame;
	console.log(id);
	switch(id) {
		    case 'centro_costos':
		        res.redirect('/cdc');
		        break;
		    case 'def_flujo':
		        res.render('main/flujo_view');
		        break;
		    case 'ingresos':
				res.redirect('/render_ingresos');
		        break;
			case 'todos':
				res.redirect('/pagos/render_pagos');
				break;
			case 'todos_ing':
				res.redirect('/pagos/render_ingresos');
				break;
			case 'todos_eg':
				res.redirect('/pagos/render_egresos');
				break;
		    case 'egresos':
		    	res.redirect('/render_egresos');
		        break; 
		    case 'flujo':
		    	res.redirect('/render_pagos');
		    	break;
		    case 'gastos':
		    	res.redirect('/cdc/mycdc');	       
		    	break;
		    default:
		        res.render('main/cc_view');
	}
});


router.get('/render_calendar/:indice_mes', function(req, res, next){
	var mes = req.params.indice_mes;
	req.getConnection(function(err, connection){
		connection.query("SELECT monto,fecha_p,detalle FROM egreso WHERE fecha_p BETWEEN '2017-"+mes+"-01 00:00:00' AND '2017-"+mes+"-31 00:00:00'", function(err, egresos){
			if(err){console.log("Error Selecting : %s", err);}
			connection.query("SELECT monto,fecha_p,detalle FROM ingreso WHERE fecha_p BETWEEN '2017-"+mes+"-01 00:00:00' AND '2017-"+mes+"-31 00:00:00'", function(err, ingresos){
			if(err){console.log("Error Selecting : %s", err);}
				console.log("Egresos");
				console.log(egresos);
				console.log("Ingresos");
				console.log(ingresos);

				res.render("main/calendario", {dataEgresos: egresos, dataIngresos: ingresos});			    
			});
		});
	});
});


/*router.get('/render_flujo', function(req, res, next){
	
	req.getConnection(function(err, connection){
		connection.query("SELECT egreso.monto,egreso.fecha_p,egreso.detalle,cdc.nombre,cdc.monto_final FROM egreso LEFT JOIN cdc ON egreso.idcdc=cdc.idcdc WHERE egreso.fecha_p > NOW() ORDER BY egreso.fecha_p", function(err, egresos){
			if(err){console.log("Error Selecting : %s", err);}
			connection.query("SELECT ingreso.monto,ingreso.fecha_p,ingreso.detalle,cdc.nombre,cdc.monto_final FROM ingreso LEFT JOIN cdc ON ingreso.idcdc=cdc.idcdc WHERE ingreso.fecha_p > NOW() ORDER BY ingreso.fecha_p", function(err, ingresos){
			if(err){console.log("Error Selecting : %s", err);}
				console.log("Egresos");
				console.log(egresos);
				console.log("Ingresos");
				console.log(ingresos);

				res.render("main/flujoDates", {dataEgresos: egresos, dataIngresos: ingresos});			    
			});
		});
	});	
});*/

/*router.get('/render_egresos', function(req, res, next){
	req.getConnection(function(err, connection){
		connection.query("SELECT egreso.idegreso as id,egreso.monto,egreso.fecha_p,egreso.detalle,cdc.nombre,cdc.monto_final FROM egreso LEFT JOIN cdc ON egreso.idcdc=cdc.idcdc WHERE egreso.fecha_p > NOW() ORDER BY egreso.fecha_p", function(err, egresos){
			if(err){console.log("Error Selecting : %s", err);}
			res.render("main/flujoIngresos", {dataEgresos: egresos, number: -1, titulo:"Egresos:"});
		});
	});
});
router.get('/render_ingresos', function(req, res, next){
	req.getConnection(function(err, connection){
		connection.query("SELECT ingreso.idingreso as id,ingreso.monto,ingreso.fecha_p,ingreso.detalle,cdc.nombre,cdc.monto_final FROM ingreso LEFT JOIN cdc ON ingreso.idcdc=cdc.idcdc WHERE ingreso.fecha_p > NOW() ORDER BY ingreso.fecha_p", function(err, ingresos){
			if(err){console.log("Error Selecting : %s", err);}
			res.render("main/flujoIngresos", {dataEgresos: ingresos, number: 1, titulo: "Ingresos:"});
		});
	});
});*/


router.get('/render_pagos', function(req, res, next){
			res.render("pagos/pagos_calendario", {titulo: "Calendario de Flujo: "});
});







router.get('/render_flujo', function(req, res, next){
	req.getConnection(function(err, connection){
		connection.query("SELECT egreso.idegreso as id,egreso.monto,egreso.fecha_p,egreso.detalle,cdc.nombre,cdc.monto_final FROM egreso LEFT JOIN cdc ON egreso.idcdc=cdc.idcdc WHERE egreso.fecha_p > NOW() ORDER BY egreso.fecha_p", function(err, egresos){
			if(err){console.log("Error Selecting : %s", err);}
			connection.query("SELECT ingreso.idingreso as id,ingreso.monto,ingreso.fecha_p,ingreso.detalle,cdc.nombre,cdc.monto_final FROM ingreso LEFT JOIN cdc ON ingreso.idcdc=cdc.idcdc WHERE ingreso.fecha_p > NOW() ORDER BY ingreso.fecha_p", function(err, ingresos){
				if(err){console.log("Error Selecting : %s", err);}
				console.log("ANTES");
				console.log(ingresos);
				for(var i=0; i < egresos.length; i++){
					egresos[i].monto = egresos[i].monto*-1;
					ingresos[ingresos.length] = egresos[i];
				}
				ingresos = burbuja(ingresos);
				console.log("DESPUES");
				console.log(ingresos);
				res.render("main/flujoIngresos", {dataEgresos: ingresos, number: 1, titulo: "Ingresos:"});
				//res.render("main/flujoCalendario", {dataIngresos: ingresos,dataEgresos: egresos, titulo: "Calendario de flujo: "});
				});
		});
	});
});

function burbuja(miArray)
	{
		for(var i=1;i<miArray.length;i++)
		{
			for(var j=0;j<(miArray.length-i);j++)
			{
				if(miArray[j].fecha_p > miArray[j+1].fecha_p)
				{
					k=miArray[j+1];
					miArray[j+1]=miArray[j];
					miArray[j]=k;
				}
			}
		}
		return miArray;
	}
router.get('/save_date/:idpago/:fecha', function(req, res, next){
	var input = req.params;
	req.getConnection(function(err, connection){
		connection.query("UPDATE pago SET fecha_p = '"+input.fecha+"' WHERE idpago = "+input.idpago, function(err, ingresos){
				if(err){console.log("Error Selecting : %s", err);}
				res.redirect('/pagos/render_carousel');
			});
	});
});
module.exports = router;
