class Evento{
		constructor(){
			this.eventos = [];
		}
		addtoList(item){
			this.eventos.push(item);
		}
	}
class Fecha{
	constructor(fecha, eventos){
		this.fecha = fecha;
		this.eventos = eventos;
	}
}
class arrayFechas{
	constructor(fechas){
		this.fechas = fechas;
	}
	fechaExiste(fecha){
		for(var i=0; i<this.fechas.length; i++){
			if(this.fechas[i].fecha.substring(0,15) == fecha.substring(0,15)){
				return i;
			}
		}
		return -1;
	}
	render(){
		var html = "";
		for(var i=0; i< this.fechas.length; i++){
			var fecha = this.fechas[i].fecha;
			var dia_semana = fecha.substring(0,3);
			var dia = fecha.substring(8,10);
			var mes = fecha.substring(4,7);
			var ano = fecha.substring(11,15);
			html += "<div class='item imporDate'>\n";
			html += "<b>Fecha: </b>"+traduceDia(dia_semana)+" "+dia+" de "+traduceMes(mes)+" de "+ano+"\n"; 
			html += "<ul>\n";
			var eventos = this.fechas[i].eventos.eventos;
			for(var j=0; j < eventos.length; j++){
				html += "<li>";
				html += "<div>"+eventos[j].detalle+"</div>\n";
				html += "<div>$"+eventos[j].monto+"</div>\n";
				html += "<div>"+eventos[j].nombre_cdc+"</div>\n";
				html += "</li>";
			}
			html += "</ul>\n";

			html += "<button class='btn btn-primary' type='button' data-toggle='collapse' data-target='#collapse"+i
			+ "' aria-expanded='false' aria-controls='collapse"+i+"'>Modificar evento</button>\n";
			//html += this.renderColapse(html, i);
			html += "<div class='collapse' id='collapse"+i+"'>\n"
		 		+	"<div class='card card-body'>\n"
		  		+		"<label for='date'>Ingrese nueva fecha:</label>\n"
		    	+		"<div class='input-group' id='date' style='width: 50%'>\n"	
		    	+			"<span class='input-group-addon' id='basic-addon1'>@</span>\n"
				+ 			"<input type='date' class='form-control' placeholder='Ingrese nueva fecha' aria-label='Username' aria-describedby='basic-addon1'>\n"
				+"</div></div></div>\n";
			html += "</div>\n";
		}
		return html;
	}
}

function traduceMes(mes){
	if(mes == 'Dec'){
		return "Diciembre";
	}
	else if(mes == 'Jan'){return "Enero";}
	else if(mes == 'Feb'){return "Febrero";}
	else if(mes == 'Mar'){return "Marzo";}
	else if(mes == 'Apr'){return "Abril";}
	else if(mes == 'May'){return "Mayo";}
	else if(mes == 'Jun'){return "Junio";}
	else if(mes == 'Jul'){return "Julio";}
	else if(mes == 'Aug'){return "Agosto";}
	else if(mes == 'Sep'){return "Septiembre";}
	else if(mes == 'Oct'){return "Octubre";}
	else if(mes == 'Nov'){return "Noviembre";}
}


function traduceDia(dia){
	if(dia == 'Fri'){
		return "Viernes";
	}
	else if(dia == 'Sat'){return "Sabado";}
	else if(dia == 'Sun'){return "Domingo";}
	else if(dia == 'Mon'){return "Lunes";}
	else if(dia == 'Tue'){return "Martes";}
	else if(dia == 'Wed'){return "Miercoles";}
	else if(dia == 'Thu'){return "Jueves";}
}