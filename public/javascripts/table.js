var tableObj = {
	tableData: [],
	headerData: ['ID', 'First Name', 'Last Name', 'State', 'Product', 'Average NRx', 'Average TRx'],
	prevSortIndex: -1,
	productListArray: [],
	roundNumber: function(num){
		return Math.round(num * 100.0) / 100.0;
	},
	makeTable: function(){

		for (let i in jsonData) {
			let temp = [];
			temp.push(parseInt(jsonData[i].id));
			temp.push(jsonData[i].first_name);
			temp.push(jsonData[i].last_name);
			temp.push(jsonData[i].State);
			temp.push(jsonData[i].Product);
			// temp.push(jsonData[i].total_NRx);
			// temp.push(jsonData[i].total_TRx);
			temp.push(this.roundNumber(jsonData[i].average_NRx));
			temp.push(this.roundNumber(jsonData[i].average_TRx));

			this.tableData.push(temp);
		}
		tableObj.updateTable(0);

		let htmlOut = "";
		this.productListArray = Array.from(productList);
		for(let i in this.productListArray){
			htmlOut += "<div class='form-check'>";
			htmlOut += "<input onchange='tableObj.updateTable(null);' checked class='form-check-input' type='checkbox' value='' id='table-product-checkbox-" + String(i) + "'>";
			htmlOut += "<label class='form-check-label' for='table-product-checkbox-" + String(i) + "'>" + String(this.productListArray[i]) + "</label>";
			htmlOut += "</div>";
		}
		$("#table-checkboxes").html(htmlOut);
	},
	compareColumn: function (a, b, key, reverse = false) {
		if (a[key] === b[key]) {
			return 0;
		}
		else {
			if (reverse) {
				return (a[key] < b[key]) ? 1 : -1;
			} else {
				return (a[key] < b[key]) ? -1 : 1;
			}
		}
	},
	updateTable: function(sortIndex){

		arr = JSON.parse(JSON.stringify(this.tableData));

		for(let i in this.productListArray){
			if(!$("#table-product-checkbox-" + String(i)).prop('checked')){
				for(let k = 0; k < arr.length; k++){
					if(arr[k][4] == this.productListArray[i]){
						arr.splice(k, 1);
						k--;
					}
				}
			}
		}


		let reverse = false;

		if(sortIndex == null){
			reverse = sortIndex < 0;
		}else{
			if(this.prevSortIndex == sortIndex){
				this.prevSortIndex = -sortIndex - 1;
				reverse = true;
			}else{
				this.prevSortIndex = sortIndex;
			}
		}

		arr.sort(function(a, b){return tableObj.compareColumn(a,b,sortIndex, reverse);});


		let rows = parseInt($("#table-rows").val());
		if(rows > 0){
			arr = arr.splice(0, rows);
		}else if(rows == 0) {
			arr = [];
		}
		
		let htmlOut = "<table class='table table-hover table-secondary'>";
		htmlOut+= "<thead><tr>";
		for(let i in this.headerData){
			htmlOut += "<th class='text-center' onclick='tableObj.updateTable(" + String(i) + ");'>" + String(this.headerData[i]) + "</th>";
		}
		htmlOut+= "</tr></thead><tbody>";
		for(let y in arr){
			htmlOut += "<tr>";
			for(let x in arr[y]){
				htmlOut += "<th class='text-center p-0'>" + String(arr[y][x]) + "</th>";
			}
			htmlOut += "</tr>";
		}
		htmlOut+= "</tbody></table>";

		$("#table-output").html(htmlOut);
	}
};