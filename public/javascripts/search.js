
var chartGraphTRx;
var chartGraphNRx;
var searchGraphTRx = [];
var searchGraphNRx = [];
var searchGraphTRxReg = [{x:1, y:0}, {x:6, y:0}];
var searchGraphNRxReg = [{x:1, y:0}, {x:6, y:0}];

function search(name){
	let names = name.split(" ");

	let bestNameCount = 0;
	let index = -1;
	for(let d in jsonData){
		matchCount = 0;
		for(let n in names){
			if(jsonData[d].first_name.toLowerCase() === names[n].toLowerCase()){
				matchCount++;
			}else if(jsonData[d].last_name.toLowerCase() === names[n].toLowerCase()){
				matchCount++;
			}
		}
		if(matchCount > bestNameCount){
			index = d;
			bestNameCount = matchCount;
		}
	}

	if(index != -1){
		searchId(jsonData[index].id);
	}else{
		alert("Doctor Not Found!");
	}
	
}

function searchId(id){
	let docData = null;
	for(let i in jsonData){
		if(jsonData[i].id == id){
			docData = jsonData[i];
		}
	}
	console.log(docData);
	if(docData){
		$("#s-name").text(docData.first_name + " " + docData.last_name);
		$("#s-id").text(docData.id);
		$("#s-product").text(docData.Product);
		$("#s-state").text(docData.State);
		$("#s-average-NRx").text(docData.average_NRx.toFixed(2));
		$("#s-average-TRx").text(docData.average_TRx.toFixed(2));

		
		while(searchGraphTRx.length > 0){
			searchGraphTRx.pop();
		}

		while(searchGraphNRx.length > 0){
			searchGraphNRx.pop();
		}

		for(let x = 1; x < 7; x++){
			let NRx_item = 'NRx_Month_' + String(x);
			let TRx_item = 'TRx_Month_' + String(x);
			searchGraphNRx.push({x: x, y: docData[NRx_item]});
			searchGraphTRx.push({x: x, y: docData[TRx_item]});
		}
		
		let NRx_equation = docData.reg_NRx.equation;
		let TRx_equation = docData.reg_TRx.equation;
		searchGraphNRxReg[0] = {x:1, y: NRx_equation[0] * 1.0 + NRx_equation[1]};
		searchGraphNRxReg[1] = {x:8, y: NRx_equation[0] * 8.0 + NRx_equation[1]};
		
		searchGraphTRxReg[0] = {x:1, y: TRx_equation[0] * 1.0 + TRx_equation[1]};
		searchGraphTRxReg[1] = {x:8, y: TRx_equation[0] * 8.0 + TRx_equation[1]};

		
		chartGraphNRx.update();
		chartGraphTRx.update();
		//clear inputs
		$("#s-search-id").val("");
		$("#s-search-name").val("");
	}
}


function searchGraphs(){

	const dataTRx = {
		labels: [1,2,3,4,5,6, 7, 8],
		datasets: [
			{
				label: 'TRx',
				data: searchGraphTRx,
				cubicInterpolationMode: 'monotone',
				borderColor: 'rgb(83, 123, 196)'
			},
			{
				label: 'Trend TRx',
				data: searchGraphTRxReg,
				borderColor: 'rgb(0, 169, 80)',
				borderDash: [5, 5]
			},
			{
				label: 'Average',
				data: [{x:1,y:overall.average_TRx},{ x:6,y:overall.average_TRx}],
				borderColor: 'rgb(128, 35, 146)'
			}
		]
	};

	const dataNRx = {
		labels: [1,2,3,4,5,6,7,8],
		datasets: [
			{
				label: 'NRx',
				data: searchGraphNRx,
				cubicInterpolationMode: 'monotone',
				borderColor: 'rgb(83, 123, 196)'
			},
			{
				label: 'Trend NRx',
				data: searchGraphNRxReg,
				borderColor: 'rgb(0, 169, 80)',
				borderDash: [5, 5]
			},
			{
				label: 'Average',
				data: [{x:1,y:overall.average_NRx},{ x:6,y:overall.average_NRx}],
				borderColor: 'rgb(128, 35, 146)'
			}
		]
	};

	const configTRx = {
		type: 'line',
		data: dataTRx,
		options: {
			responsive: true,
			plugins: {
				legend: {
					position: 'right',
				},
				title: {
					display: true,
					text: 'TRx over time'
				}
			},
			scales: {
				x: {
					type: 'linear',
					position: 'bottom',
					title: {
						display: true,
						text: 'Month',
					}
				},
				y: {
					type: 'linear',
					position: 'left',
					title: {
						display: true,
						text: 'TRx',
					}
				}
			},
		},
	};

	const configNRx = {
		type: 'line',
		data: dataNRx,
		options: {
			responsive: true,
			plugins: {
				legend: {
				position: 'right',
				},
				title: {
				display: true,
				text: 'NRx over time'
				}
			},
			animations: {
				tension: {
				  	duration: 1000,
				  	easing: 'linear',
				  	from: 0,
				  	to: 0.3,
				  	loop: false
				}
			},
			scales: {
				x: {
					type: 'linear',
					position: 'bottom',
					title: {
						display: true,
						text: 'Month',
					}
				},
				y: {
					type: 'linear',
					position: 'left',
					title: {
						display: true,
						text: 'NRx',
					}
				}
			},
		},
	};

	 chartGraphTRx = new Chart(
		document.getElementById('searchGraphTRx'),
		configTRx
	);

	chartGraphNRx = new Chart(
		document.getElementById('searchGraphNRx'),
		configNRx
	);
}

$(document).ready(function(){
	$("#s-submit").click(function(e){
		let i = $("#s-search-id").val();
		let n = $("#s-search-name").val();
		if(i === ""){
			search(n);
		}else{
			searchId(i);
		}
		e.preventDefault();
	});
});
