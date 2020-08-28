 var w = 1200;
    var h = 780;
    var padding = 80;
    var spacingBetweenTeamsX = 150;
    var spacingBetweenTeamsY = 75;
    var maxCircle = 20;
    var projection = d3.geoAlbers().translate([w/2, 350])
                           // to shrink/grow the map, 1000 = 100%
                           .scale([1200]);

    // Define path generator
	var path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
  		.projection(projection); // tell path generator to use albersUsa projection

    var svg2 = d3.select("#graph")

     var schools;
    var conferences = {};
    var election = {};

    var colorKey = {"ACC": "#B6E053",
                "Big Ten": "#5A88B8",
                "WAC": "#FF6564" ,
                "SEC": "#7CC4CC",
                "Big East": "#C67194",
                "Solano":  "#FFDE50",
                "Sonoma": "#FFAC6F",
                "Napa": "#24B086",
                "Santa Cruz": "#BB998C",
                "San Francisco": "#473C6C"};
    var redblueColorScale = ["#ff0000", "#ff8080", "#ffffff", "#80a1ff", "#0044ff"]
    var revScale;
    var expScape;
    var colorScale;
    var d = 1000;

    d3.csv("Election.csv", mutateRow, function(data) {
     d3.csv("Schools.csv", mutateRow2, function(data) {
      schools = data
      var revenues = schools.map(function(school){
          return school.rev
      })
      var expenses = schools.map(function(school){
          return school.exp
      })
      revScale = d3.scaleSqrt()
        .domain([0,d3.max(revenues)])
        .range([0,maxCircle])
      expScale = d3.scaleSqrt()
        .domain([0,d3.max(expenses)])
        .range([0,maxCircle])
      colorScale = d3.scaleLinear()
        .domain([.5,.25,0,-.25,-.5])
        .range(redblueColorScale);
      drawGraph();
    });
  });

  function mutateRow(row){
    election[row.STATE] = Number(row.Diff)
    return row;
  }

      // Turns the data into numbers from the csv file
   function mutateRow2(row) {
      row['lat'] = Number(row['lat']);
      row['long'] = Number(row['long']);
      row['tix'] = Number(row['tix']);
      row['guarantees'] = Number(row['guarantees']);
      if (!Object.keys(conferences).includes(row['conf'])){
        conferences[['conf']] = 0
      } else {
        conferences[['conf']] += 1
      }
      return row;
  }

  function formatNumber(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

  function drawGraph(){
    svg2.selectAll("path")
         .data(states[0].features)
         //enter links the data up with the "path"
         .enter()
         .append("path")
         .attr("d", path)
         //map styles
         .style("opacity", "1")
         .style("stroke", "gray")
          .style("stroke-width", "1")
          .style("fill", function(d,i){
             var s = d.properties.name
             console.log(s)
             console.log(election[s])
             return colorScale(election[s]);
          })
          .attr("class","state")
          .style("pointer-events", "none")

    //selecting the circles and appending one for each school
      svg2.selectAll("circle")
         .data(schools)
         .enter()
         .append("circle")
         .attr("cx", function(d){
            return projection([d.long,d.lat])[0];
         })
         .attr("cy", function(d){
            return projection([d.long,d.lat])[1];
         })
         .attr("r", function(d){
          return 7;//revScale(d.rev);
         })
         .style("fill", function(d){
            return (d.playing == "1" ? 'white' : 'black')
         ;})
        .style("stroke", function(d){
            return 'black';
         ;})
        .style("stroke-width", function(d){
            return 1;
         ;})
         .style("opacity", 1)
         .attr("class", "schoolCircle")
         .on("mouseover",function(d,i){
            handleMouseover(d,i)
            d3.select(this).attr('r',10)
          })
         .on("mouseout",function(d,i){
            handleMouseout()
            d3.select(this).attr('r',7)
          })
         //.on("click",handleClick)

     //selecting the circles and appending one for each school
      svg2.selectAll("text")
         .data(schools)
         .enter()
         .append("text")
         .attr("x", function(d){
            return projection([d.long,d.lat])[0];
         })
         .attr("y", function(d){
            return projection([d.long,d.lat])[1] - 10;
         })
         .attr("stroke", function(d){
            return "black"
         ;})
         .attr('text-anchor', 'middle')
         .style('font-size','10pt')
         .style("opacity", 0)
         .attr("class", "schoolLabel")
         .style("pointer-events", "none")
         .text(function(d){
            return d.school
        });

    svg2.append('text')
      .attr('x',padding)
      .attr('y',padding/2)
      .attr('text-anchor', 'middle')
        .style('font-size','20pt')
        .style("opacity", 0)
        .attr("class", "backArrow")
      .text('← Back')
      .on('mouseover',function(){
        d3.select(this)
          .style('font-weight','bold')
      })
      .on('mouseout',function(){
        d3.select(this)
          .style('font-weight','normal')
      })
      .on('click',function(){
        d3.select(this).transition().duration(d)
          .style('opacity',0)
        if (document.getElementById("show_sorted").classList.contains("selected")){
          transitionSorted()
        } else if (document.getElementById("show_map").classList.contains("selected")){
          transitionMap()
        } else {
          if (document.getElementById("sort_rev").classList.contains("selected")){
          transitionGrid('rev');
        } else {
          transitionGrid('exp');
        }
        }
      })

      function handleMouseover(d,i){
        d3.select("#tooltip")
            .style("left", (d3.event.pageX) + 20 + "px")
            .style("top", (d3.event.pageY) - 30 + "px")
            .select("#value")
            .text(d.school);
        d3.select('#conference')
            .text('(' + d.conf + ')');
        d3.select('#name')
            .text(d.school);
        d3.select("#tooltip").classed("hidden", false);
        if (d.tix == -1){
          d3.select('#tix')
              .text("Data Not Public");
          d3.select('#guarantees')
              .text("Data Not Public");
        } else {
          d3.select('#tix')
              .text("$" + formatNumber(d.tix));
          d3.select('#guarantees')
              .text("$" + formatNumber(d.guarantees));
        }
        
             
  }

  function handleMouseout(){
    d3.select("#tooltip").classed("hidden", true);
  }

  function handleClick(data,i){
    d3.select("#tooltip").classed("hidden", true);

      svg2.selectAll(".schoolLabel").filter(function (data2) { 
      return data2.school != data.school; 
    })
    .transition().duration(d*2)
          .style("opacity", 0)

      svg2.selectAll(".schoolCircle")
    .transition().duration(d*2)
          .style("opacity", 0)

      svg2.selectAll(".state").transition().duration(d*2)
        .style('opacity',0)

      svg2.selectAll(".backArrow").transition().duration(d)
        .style('opacity',1)

      svg2.selectAll(".schoolLabel").filter(function (data2) { 
      return data2.school == data.school; 
    })
    .transition().duration(d*2)
          .attr("x", w/2)
          .attr("y", padding)
          .style("opacity", 1)
          .style("font-size",'30pt')


      /*d3.select(this)
      .attr({
              fill: "orange",
              r: radius * 2
            });*/
  }

  var gradients = 0;

  var colorScale2 = d3.scaleLinear()
    .domain([0,2.5,5,7.5,10])
    .range(redblueColorScale);

  for (var i = 0; i < 11; i++){
    svg2.append('rect')
      .attr('id', 'gradient' + gradients + 'rect' + i)
      .attr('x',w/2 - 15 * 5 + 15 * i)
      .attr('y', 40)
      .attr('width',14)
      .attr('height',14)
      .attr('fill', colorScale2(i));
    console.log(i);
    console.log(colorScale2(i));
  }

  svg2.append('text')
    .attr('id', 'gradientVariable')
    .attr('class','gradientText')
    .attr('x',w/2)
    .attr('y',20)
    .attr('text-anchor','middle')
    .text('2016 General Election Results')
  svg2.append('text')
    .attr('id', 'gradientMinText')
    .attr('class','gradientText')
    .attr('x',w/2 - 15 * 5)
    .attr('y',80)
    .attr('text-anchor','middle')
    .text('Trump + 50')
  svg2.append('text')
    .attr('id', 'gradientMaxText')
    .attr('class','gradientText')
    .attr('x',w/2 + 15 * 5)
    .attr('y',80)
    .attr('text-anchor','middle')
    .text('Clinton +50')
  
  svg2.append("circle")
         .attr("cx", w/2 + 150)
         .attr("cy", 30)
         .attr("r", 7)
         .style("fill", 'black')
        .style("stroke", 'black')
        .style("stroke-width", 1)
        .style("opacity", 1)
   svg2.append("circle")
         .attr("cx", w/2 + 150)
         .attr("cy", 50)
         .attr("r", 7)
         .style("fill", 'white')
        .style("stroke", 'black')
        .style("stroke-width", 1)
        .style("opacity", 1)
    svg2.append("text")
         .attr("x", w/2 + 160)
         .attr("y", 35)
        //.style("stroke", 'black')
        .style("font-size", '10pt')
        .style("opacity", 1)
        .text('Canceled Football')
    svg2.append("text")
         .attr("x", w/2 + 160)
         .attr("y", 55)
        //.style("stroke", 'black')
        .style("font-size", '10pt')
        .style("opacity", 1)
        .text('Still Playing Football')

}