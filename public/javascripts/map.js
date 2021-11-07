

function makeMap(){
	let p = $("#map").parent();
	$("#map").remove();
	p.append("<div id='map' sytle='width: 0.8*80vw; height: 0.8*54.19vw;'></div>");

	TRxOrNRx = $("#map-TRxOrNRx").prop('checked');
	perPopulation = $("#map-population").prop('checked');


	let states = {};
    let statesAbr = declareStates();
	let population = populationStates();

	for(let i in jsonData){
		let s = jsonData[i].State;
		if(s in states){
			if(TRxOrNRx) states[s] += jsonData[i].total_NRx;
			else states[s] += jsonData[i].total_TRx;
		}else{
			if(TRxOrNRx) states[s] = jsonData[i].total_NRx;
			else states[s] = jsonData[i].total_TRx;
		}
	}

	if(perPopulation){
		for(let i in states){
			states[i] /= population[i];
		}
	}

	let maximum = 0;
	for(let i in states){
		if(states[i] > maximum){
			maximum = states[i];
		}
	}

	let percent = {};
	for(let i in states){
		percent[i] = states[i] / maximum;
	}
	
	
	let dict = {};
    let dictPlus = {};
    for(let i in statesAbr){
        let state = statesAbr[i];
		if(!(state in percent)){
			percent[state] = 0;
		}
        let hexColor = (255-(parseInt(percent[state] * 255))).toString(16);
        // console.log(hexColor);
		if(hexColor.length == 1) hexColor = "0" + hexColor;
		dict[i] = {fill: (`#${hexColor}` + 'ff' + `${hexColor}`)};
        dictPlus[i] = 'test';
    }
	// console.log(dict);
	$('#map').usmap({
		stateSpecificStyles: dict,
        stateSpecificHoverStyles: dict,
        showLabels: true,
        click: function(event, data) {
            $('#clicked-state')
              .html(statesAbr[data.name] + '<br/>' + 'Percentile compared to other states: ' 
              + (percent[statesAbr[data.name]] * 100).toFixed(2));
          }
	});

	$("#map2").html($("#map").html())

}
