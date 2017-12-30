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

router.get('/render_pagos', function(req, res, next){
	req.getConnection(function(err,connection){
        if(err){console.log("Error Selecting : %s", err);}
        connection.query("SELECT * FROM cdc",function(err,rows){
            if(err){console.log("Error Selecting : %s", err);}
            res.render("pagos/pagos_calendario", {titulo: "Proyeccion de Pagos ",data:rows});
        });
	});
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
