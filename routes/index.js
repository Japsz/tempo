var express = require('express');
var router = express.Router();

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

module.exports = router;
