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
  res.render('main/index', { title: 'Bienvenido' });
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

router.get('/render_pagos', function(req, res, next){
			res.render("pagos/pagos_calendario", {titulo: "Proyeccion de Pagos: "});
});


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
