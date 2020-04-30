  var svg = d3.select("#graph");
  var rawData;
  var dictData = {};
  var teams = [];
  var padding = 75;
  var paddingTop = 150;
  var offset = 500;
  var colors = {"R Ticket Sale": "#B6E053", "R Institutional Support": "#5A88B8", "R Contributions": "#FF6564", "R Media Rights": "#C67194", 
                "R NCAA Distributions": "#7CC4CC",
                "R Bowl Generated Revenue": "#FFDE50", "R Licensing and Ads": "#BB998C", "R Miscellaneous": "#473C6C"}
  var colors2 = ["#B6E053", "#5A88B8", "#FF6564", "#7CC4CC", "#C67194", "#FFDE50", "#FFAC6F", "#24B086", "#BB998C","#473C6C"];

   function formatNumber(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

// Turns the data into numbers from the csv file
   function mutateRow(row) {
    Object.keys(row).forEach(function(key,index){
      if (key != "Team"){
        row[key] = Number(row[key]);
      }
    })
    dictData[row["Team"]] = row;
    return row;
  }

  // Clears the svg, calls in the data, and calls the individual functions for each graph
  function graphIt(){
    svg.selectAll("*").remove();
    d3.csv("ncaareport.csv", mutateRow, function (error, data) {
      teams = Object.keys(dictData);
      rawData = data.slice(0,data.length-1);
      dashboard(rawData);
    });
  }

  graphIt();

  function dashboard(fData){
    var barColor = 'grey';

    svg.append("text").text("College Athletics Financials")
    .attr('x',600)
    .attr('y',50)
    .attr('stroke','black')
    .attr('text-anchor','middle')
    .style('font-size','20pt')
    
    // function to handle histogram.
    function histoGram(data,column,blank){
        var fD = getTopBlank(rawData, column, blank);

        var hG ={}
        var m = d3.max(fD, function(d) { return d[column]; })
        var theseTeams = fD.map(function(item){
            return item["Team"];
        })

        // create function for x-axis mapping.
        var x = d3.scaleBand()
                .domain(theseTeams)
                .range([0, 500])
                .padding(0.1)

        // Add x-axis to the histogram svg.
        svg.append("g").attr("class", "xaxis")
            .attr("transform", "translate(" + padding + "," + (300 + paddingTop) + ")")
            .call(d3.axisBottom(x));

        // Create function for y-axis map.
        var y = d3.scaleLinear()
                .domain([0, m])
                .range([300,0])

        // Add y-axis to the histogram svg.
        var yCall = svg.append("g").attr("class", "yaxis")
            .attr("transform", "translate(" + padding + ", " + paddingTop + ")")
            .call(d3.axisLeft(y));

        // Create bars for histogram to contain rectangles and freq labels.
        var bars = svg.selectAll(".bar").data(fD).enter()
                .append("g").attr("class", "bar");
        
        //create the rectangles.
        bars.append("rect")
            .attr("x", function(d) { return x(d["Team"]) + padding; })
            .attr("y", function(d) { return y(d[column]) + paddingTop; })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return 300 - y(d[column]); })
            .attr('fill',barColor)
            .on("mouseover",mouseover)// mouseover is defined below.
            .on("mouseout",mouseout);// mouseout is defined below.
            
        //Create the frequency labels above the rectangles.
        bars.append("text").text(function(d){ return d[column] == 0 ? "" : "$" + formatNumber(d[column])})
            .attr("x", function(d) { return x(d["Team"])+x.bandwidth()/2 + padding; })
            .attr("y", function(d) { return y(d[column]) + paddingTop -5; })
            .style("font-size", "6pt")
            .attr("text-anchor", "middle");

        svg.append("text")
            .attr("class","histHead")
            .text(column.substring(2) + " " + (column.substring(0,2) == "R " ? "Revenue" : "Expenses"))
            .attr("x", padding + 250)
            .attr("y", paddingTop - 30)
            .style("font-size", "12pt")
            .attr("text-anchor", "middle");
        
        function mouseover(d){  // utility function to be called on mouseover.
                           
            // call update functions of pie-chart and legend.    
            pC.update(d["Team"],column.substring(0,2));
            //leg.update(nD);
        }
        
        function mouseout(d){    // utility function to be called on mouseout.
            // reset the pie-chart and legend.    
            pC.update("Overall",column.substring(0,2));
        }
        
        // create function to update the bars. This will be used by pie-chart.
        hG.update = function(vari, color){
            // update the domain of the y-axis map to reflect change in frequencies.
            y.domain([0, d3.max(rawData, function(d) { return d[vari]; })]);
            
            // transition the height and color of rectangles.
            bars.select("rect").transition().duration(500)
                .attr("y", function(d) {return y(d[vari]) + paddingTop; })
                .attr("height", function(d) { return 300 - y(d[vari]); })
                .attr("fill", color);

            // transition the frequency labels location and change value.
            bars.select("text").transition().duration(500)
                .text(function(d){ return d[vari] == 0 ? "" : formatNumber(d[vari])})
                .attr("y", function(d) {return y(d[vari]) + paddingTop - 5; });    

            var t = d3.transition().duration(500);
            yCall.transition(t).call(d3.axisLeft(y).bind(this));

            svg.select(".histHead").text(vari.substring(2));
        }        
        return hG;
    }
    
    // function to handle pieChart.
    function pieChart(dictData,row,revenue){

        var pD = getPies(dictData,row,revenue);

        var pC ={};    
        
        var pieG = svg.append("g")
          .attr("transform", "translate(" + (660 + padding) + "," + (150 + paddingTop) + ")");

        // create function to draw the arcs of the pie slices.
        var arc = d3.arc().outerRadius(150).innerRadius(0);

        // create a function to compute the pie slice angles.
        var pie = d3.pie().value(function(d) { return d.value; })
                    .sort(null)//.sort(function(a, b) { return d3.ascending(a.key, b.key);} );

        // Draw the pie slices.
        pieG.selectAll("path").data(pie(pD)).enter().append("path")
            .attr("d", arc)
            .each(function(d) { this._current = d; })
            .style("fill", function(d,i) { return colors2[i%10]; })
            .attr("stroke", "white")
            .style("stroke-width", "1px")
            .style("opacity", 1)
            .on("mouseover",mouseover).on("mouseout",mouseout);

        console.log(pD);

        pieG.selectAll("legendBox").data(pD).enter().append("rect")
          .attr('class',"legendBox")
          .attr('x',175)
          .attr('y',function(d,i){ return - 75 + 20 * i})
          .attr('height',10)
          .attr('width',10)
          .attr("fill",function(d,i) { return colors2[i%10];})

        pieG.selectAll("legendText").data(pD).enter().append("text")
          .attr("class",'legendText')
          .attr('x',195)
          .attr('y',function(d,i){ return - 75 + 20 * i + 10})
          .attr('stroke','black')
          .text(function(d,i){ return "$" + formatNumber(d.value) + "  " + d.key.substring(2)})

        pieG.append("text")
          .attr("class","legendTotal")
          .attr('stroke','black')
          .attr('x',125)
          .attr('y', - 150 + 10)
          .attr('font-size',"12pt")
          .text("Total " + (revenue == "R " ? "Revenue" : "Expenses") + ": $" + formatNumber(dictData[row][revenue + "Total"]))


        // create function to update pie-chart. This will be used by histogram.
        pC.update = function(newRow,newR){
            var newData = getPies(dictData,newRow,newR);

            pieG.selectAll("path").data(pie(newData)).transition().duration(500).attrTween("d", arcTween);

            var u = pieG.selectAll('.legendText').remove()

            pieG.selectAll("legendText").data(newData).enter()
              .append("text")
              .attr("class",'legendText')
              .attr('x',195)
              .attr('y',function(d,i){ return - 75 + 20 * i + 10})
              .attr('stroke','black')
              .text(function(d,i){ return "$" + formatNumber(d.value) + "  " + d.key.substring(2)})

            pieG.select(".legendTotal").text(newRow + " " + (newR == "R " ? "Revenue" : "Expenses") + ": $" + formatNumber(dictData[newRow][newR + "Total"]))
        }        
        
        // Utility function to be called on mouseover a pie slice.
        function mouseover(d,i){
            pieG.selectAll("path")
              .style('opacity',function(da){return da.data.key == d.data.key ? 1 : 0.3})
            pieG.selectAll(".legendBox")
              .style('opacity',function(da){return da.key == d.data.key ? 1 : 0.3})
            pieG.selectAll(".legendText")
              .style('opacity',function(da){return da.key == d.data.key ? 1 : 0.3})

            // call the update function of histogram with new data.
            hG.update(d.data.key,colors2[i%10])
        }
        //Utility function to be called on mouseout a pie slice.
        function mouseout(d,i){
              pieG.selectAll("path")
              .style('opacity',1)
              pieG.selectAll(".legendBox")
              .style('opacity',1)
              pieG.selectAll(".legendText")
              .style('opacity',1)
            // call the update function of histogram with all data.
            hG.update("R Total",barColor);
        }
        // Animating the pie-slice requiring a custom function which specifies
        // how the intermediate paths should be drawn.
        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) { return arc(i(t)); };
        }    

        return pC;
    }

    function getTopBlank(data, sortable, blank){
      data.sort(function(a,b){ 
        return b[sortable] - a[sortable];
      })
      return data.slice(0,blank)
    }

    function getPies(data,index,which){
      return d3.entries(data[index]).filter(function(item,index){
        return item.key.substring(0,2) == which && item.key != which + "Total";
      })
    }

    var hG = histoGram(rawData, "R Total", 8), // create the histogram.
        pC = pieChart(dictData,"Overall", "R "); // create the pie-chart.
  }


