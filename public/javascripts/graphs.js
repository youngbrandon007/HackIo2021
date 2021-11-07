var chartScatter;
var scatterDataset;

var chartProductNRx;
var chartProductTRx;

var passJson;

function productChart(mData) {
	let datasetNRx = [];
	let datasetTRx = [];	
    let colors = ['rgb(255, 99, 132)', 'rgb(135,206,235)', 'rgb(255,215,0)','rgb(127,255,0)'];
	let productLabels = ['Cholecap', 'Zap-a-Pain', 'Nasalclear', 'Nova-itch'];
    let index = 0;
	for(let product in mData){
		let dataNRx = [];
		let dataTRx = [];
		for(let month = 0; month < 6; month++){
			dataNRx.push({x: (month + 1), y: mData[product]["average_NRx"][month]});
			dataTRx.push({x: (month + 1), y: mData[product]["average_TRx"][month]});
		}
		datasetNRx.push({
			label: productLabels[index],
			data: dataNRx,
			borderColor: colors[index],
			backgroundColor: colors[index],
			cubicInterpolationMode: 'monotone'
		});
		datasetTRx.push({
			label: productLabels[index],
			data: dataTRx,
			borderColor: colors[index],
			backgroundColor: colors[index],
			cubicInterpolationMode: 'monotone'
		});
		index++;
	}

	const configNRx = {
		type: 'line',
		data: {
			labels: [1,2,3,4,5,6],
			datasets: datasetNRx
		},
		options: {
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
			plugins: {
				legend: {
					position: 'right',
				},
				title: {
					display: true,
					text: 'Comparison of NRx across Product Lines'
				},
			},
		}
	}

	const configTRx = {
		type: 'line',
		data: {
			labels: [1,2,3,4,5,6],
			datasets: datasetTRx,
		},
		options: {
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
			plugins: {
				legend: {
					position: 'right',
				},
				title: {
					display: true,
					text: 'Comparison of TRx across Product Lines'
				},
			},
		}
	}

	chartProductNRx = new Chart(
		document.getElementById('productChartNRx'),
		configNRx
	);

	chartProductTRx = new Chart(
		document.getElementById('productChartTRx'),
		configTRx
	);
	
	chartProductNRx = new Chart(
		document.getElementById('productChartNRxCopy'),
		configNRx
	);

	chartProductTRx = new Chart(
		document.getElementById('productChartTRxCopy'),
		configTRx
	);
}

function scatterChartDataSet(mData, ranges){
	let dataset = [];	
    let colors = ['rgb(255, 99, 132)', 'rgb(135,206,235)', 'rgb(255,215,0)','rgb(127,255,0)'];
	let pStyle = ['circle','rectRot','triangle','rectRounded'];
    let index = 0;
	for (let i in mData){
		
		let data = [];
		for(let j = 0; j < mData[i].length; j++){
			let x = mData[i][j].average_TRx;
			let y = mData[i][j].average_NRx;
			//isNaN(ranges[0][0]) || x > ranges[0][0]
			if((isNaN(ranges[0][0]) || x >= ranges[0][0]) && (isNaN(ranges[0][1]) || x <= ranges[0][1]) && (isNaN(ranges[1][0]) || y >= ranges[1][0]) && (isNaN(ranges[1][1]) || y <= ranges[1][1])){
				data.push({
					x: x,
					y: y,
					name: mData[i][j].last_name + ", " + mData[i][j].first_name,
					id: mData[i][j].id
				});
			}
			
		}

		dataset.push({
			label: mData[i][0].Product,
			data: data,
			backgroundColor: colors[index],
			pointStyle: pStyle[index]
		});

		index++;
	}


	return dataset;
}

function scatterChart(mData, ranges=[[NaN, NaN], [NaN, NaN]]){

	scatterDataset = scatterChartDataSet(mData, ranges);
	const config = {
		type: 'scatter',
		data: {datasets: scatterDataset},

		options: {
			scales: {
				x: {
					type: 'linear',
					position: 'bottom',
                    title: {
                        display: true,
                        text: 'Average TRx over 6 months',
                    }
				},
                y: {
					type: 'linear',
					position: 'left',
                    title: {
                        display: true,
                        text: 'Average NRx over 6 months',
                    }
				}
			},
            plugins: {
                legend: {
                  position: 'right',
                },
                title: {
                  display: true,
                  text: 'Average NRx vs Average TRx'
                },
                tooltip:{
                    enabled: true,
                    callbacks: {
						label: function(item){
                            let output = [item.raw.name];
                            
							output.push("ID: " + item.raw.id);
							output.push("Avg NRx: " + item.raw.y.toFixed(2));
                            output.push("Avg TRx: " + item.raw.x.toFixed(2));
						
							return output;
						}
					},
					usePointStyle: true
                }
            },
		}
	};

	chartScatter = new Chart(
		document.getElementById('scatterChart'),
		config
	);

	chartScatterCopy = new Chart(
		document.getElementById('scatterChartCopy'),
		config
	);
}



$(document).ready(function(){
	$.ajax({
		url: '/data',
		dataType: 'json',
	  }).done(function (results) {
	
		jsonData = results;
		
		console.log(jsonData);

		//Data processing

		productList = new Set();
		for(let i in jsonData){
			productList.add(jsonData[i].Product);
		}
		
		for(let i in jsonData){
			let total_NRx = 0;
			let total_TRx = 0;

			let regTRx = [];
			let regNRx = [];
			for(let x = 1; x < 7; x++){
				let NRx_item = 'NRx_Month_' + String(x);
				let TRx_item = 'TRx_Month_' + String(x);
				
				jsonData[i][NRx_item] = parseInt(jsonData[i][NRx_item]);
				jsonData[i][TRx_item] = parseInt(jsonData[i][TRx_item]);
				
				total_NRx += jsonData[i][NRx_item];
				total_TRx += jsonData[i][TRx_item];

				
				regNRx.push([x, jsonData[i][NRx_item]]);
				regTRx.push([x, jsonData[i][TRx_item]]);
			}

			
			regNRx = regression.linear(regNRx);
			regTRx = regression.linear(regTRx);

			
			jsonData[i].total_NRx = total_NRx;
			jsonData[i].total_TRx = total_TRx;
			jsonData[i].average_NRx = total_NRx / 6.0;
			jsonData[i].average_TRx = total_TRx / 6.0;
			jsonData[i].reg_NRx = regNRx;
			jsonData[i].reg_TRx = regTRx;
		}

		byProduct = {}
		productList.forEach((i) => {
			let fil = jsonData.filter(item => item.Product === i);
			byProduct[i] = fil;
		});

		productAverage = {};

		
		byProductMonth = {};
		for(let i in byProduct){
			let total_NRx = [0,0,0,0,0,0];
			let total_TRx = [0,0,0,0,0,0];
			let average_NRx = [0,0,0,0,0,0];
			let average_TRx = [0,0,0,0,0,0];
			for(let x = 1; x < 7; x++){
				let NRx_item = 'NRx_Month_' + String(x);
				let TRx_item = 'TRx_Month_' + String(x);
				for(let k in byProduct[i]){
					total_NRx[x - 1] += byProduct[i][k][NRx_item];
					total_TRx[x - 1] += byProduct[i][k][TRx_item];
				}
				let leng = byProduct[i].length;
				average_NRx[x - 1] = total_NRx[x - 1] / leng;
				average_TRx[x - 1] = total_TRx[x - 1] / leng;
			}
			byProductMonth[i] = {total_NRx: total_NRx, total_TRx:total_TRx, average_NRx: average_NRx, average_TRx: average_TRx};
		}


		let total_NRx = 0;
		let total_TRx = 0;
		for(let i in jsonData){
			total_NRx += jsonData[i].average_NRx;
			total_TRx += jsonData[i].average_TRx
		}
		overall = {total_NRx: total_NRx, total_TRx: total_TRx, average_NRx: total_NRx / jsonData.length, average_TRx: total_TRx / jsonData.length };

		passJson = jsonData;

		console.log(byProduct);
		console.log(byProductMonth);
		console.log(overall);

		scatterChart(byProduct);
		productChart(byProductMonth);
		searchGraphs();
		makeMap();
		makeReport();
		tableObj.makeTable();
	});

	$("#scatterChart").click(function(e){
		//var point = chartScatter.getSegmentsAtEvent(e);
		
		let index = chartScatter.getActiveElements()[0];

		if(index){
			let id = scatterDataset[index.datasetIndex].data[index.index].id;

			$("#s-search-id").val(id);

			$("#s-submit").click();

			setTab(null, "tab-search");
			document.getElementById("tab-search-btn").className += " active";
		}
		e.preventDefault();
	});

	$("#doc-range-apply").click(function(e){
		let x1 = parseInt($("#doc-range-x-1").val());
		let x2 = parseInt($("#doc-range-x-2").val());
		let y1 = parseInt($("#doc-range-y-1").val());
		let y2 = parseInt($("#doc-range-y-2").val());

		chartScatterCopy.destroy();
		chartScatter.destroy();
		scatterChart(byProduct, [[x1,x2],[y1,y2]]);

		e.preventDefault();
	});
});
