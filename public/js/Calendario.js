class Dia{
		constructor(dia, fecha, eventos, monto){
			this.dia = dia;//dia de la semana
			this.fecha = fecha;//dia del mes
			this.eventos = eventos;
			this.monto = monto;
		}
	}
class Mes{
	constructor(dias/*ARRAY CON DIAS*/){
		this.dias = dias;
	}
	render(){
		var html = "";
		for(var d=0; d < this.dias.length; d++){
			
			if(this.dias[d].dia == 0){
				html += "<tr>";
			}

			if(d == 0){
				html += "<tr>";
				for(var j=0; j<this.dias[d].dia ; j++){
					html += "<td></td>";
				}
			}

				
			html += "<td><div class='day-item'><div style='display: flex'><b>"+this.dias[d].fecha+"</b>";
			if(this.dias[d].eventos.length > 0){
				html += "<span class='glyphicon glyphicon-pencil'></span></div>";
				for(var h=0; h < this.dias[d].eventos.length; h++){
					html += "<p class='details'>"+this.dias[d].eventos[h]+"</p>";
				}
			}
			else{
				html += "</div><p class='details'>No hay eventos en esta fecha</p>";
			}

			if(this.dias[d].monto > 0){
				html += "<b>-$"+this.dias[d].monto+"</b>"
			}

			html += "</div></td>";
				
			if(this.dias[d].dia == 6){
				html += "</tr>";
			}
			else if(d == this.dias.length-1){
				for(var j=0; j<(6-this.dias[d].dia) ; j++){
					html += "<td></td>";
				}
				html += "</tr>";

			}
		}
		console.log("RENDERIZANDO");
		return html;
	}
}