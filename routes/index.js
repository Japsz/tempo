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
		        res.render('main/cc_view');
		        break;
		    case 'def_flujo':
		        res.render('main/flujo_view');
		        break;
		    case 'informe':
				res.render('main/informe_view');
		        break;
		    default:
		        res.render('main/cc_view');
	}
});


router.get('/render_calendar/:indice_mes', function(req, res, next){
	var mes = req.params.indice_mes;
	req.getConnection(function(err, connection){
		connection.query("SELECT monto,fecha_p,detalle FROM egreso WHERE fecha_p BETWEEN '2017-"+mes+"-01 00:00:00' AND '2017-"+mes+"-31 00:00:00'", function(err, rows){
			if(err){console.log("Error Selecting : %s", err);}
			console.log(rows);
			res.render("main/calendario", {databd: rows});			    
		});
	});
});
module.exports = router;
