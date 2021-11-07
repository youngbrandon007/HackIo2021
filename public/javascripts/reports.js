// remove later if not needed:
// Overall reports:
    // Growth/Decline of all product lines from launch to now (are we net profitable?) (Calculation: the column sum of all TRx from month 6 DIVIDEDBY (same thing) of month 1 TIMES 100)
    // Top trending product line to date (Calculation: find highest NRx slope out of all products and display slop and product line)
    // Top sales product line to date (Calculation: find sum of all months of TRx and display count and product line)
    // Year end project for all product lines (4 in our case) (Calculation: Project linear regression until the end of the year)

    // Include product graph, doctors graph, map of TRx and map of NRx
    
// Product reports:
    // Doctor who sold the most to date, TRx
    // Doctor who has the most new patients to date, NRx
    // 80% of doctors sold above INSERT NRx count

    // Include table of top 10 doctors, doctor search for the two mentioned doctors






function makeReport(){
    
    let htmlOut = ""
    for(let i in byProductMonth){
        let perc_dif = (byProductMonth[i].average_TRx[5] - byProductMonth[i].average_TRx[0]) / byProductMonth[i].average_TRx[0] * 100;
        htmlOut += "<h6> " + String(i) + ":  " + perc_dif.toFixed(2) + "%</h6>";
    }
    $("#report-growth").html(htmlOut);

    let bestTrend = null;
    let nameTrend = null;
    for(let i in byProductMonth){
        let trendArr = [];
        console.log(byProductMonth[i].average_TRx)
        for(let k in byProductMonth[i].average_TRx){
            trendArr.push([parseInt(k)+1, byProductMonth[i].average_TRx[k]]);
        }
        console.log(trendArr);

        let reg = regression.linear(trendArr);
        console.log(reg);

        if(bestTrend == null){
            bestTrend = reg;
            nameTrend = i;
        }
        if(reg.equation[0] > bestTrend.equation[0]){
            bestTrend = reg;
            nameTrend = i;
        }
    }

    $("#report-trending").text("Best Trend (highest slope of linear reg.): " + bestTrend.equation[0].toFixed(2) + " by " + nameTrend);

    let best = 0;
    let bestIndex = 0;
    for(let i in byProductMonth){
        total = 0;
        for(let k in byProductMonth[i].total_TRx){
            total += byProductMonth[i].total_TRx[k];
        }
        if(best < total){
            best = total;
            bestIndex = i;
        }
    }

    $("#report-top-sales").text("Top Sale (highest selling over six months): " + String(best) + " by " + bestIndex);


    let allMonths = [[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]];
    for(let i in byProductMonth){
        for(let k = 0; k < 6; k++){
            allMonths[k][1] += byProductMonth[i].total_TRx[k];
        }
    }

    let reg = regression.linear(allMonths);

    let proj = 12* reg.equation[0] + reg.equation[1];

    $("#report-projection").text("Projection (sixth month -> twelfth month proj): " + allMonths[5][1].toFixed(0) + " -> " + proj.toFixed(0));


}