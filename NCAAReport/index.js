    var w = 1200;
    var h = 780;
    var padding = 80;
    var spacingBetweenTeamsX = 150;
    var spacingBetweenTeamsY = 75;
    var maxCircle = 20;
    var projection = d3.geoAlbers().translate([w/2, 300])
                           // to shrink/grow the map, 1000 = 100%
                           .scale([1000]);

    // Define path generator
	var path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
  		.projection(projection); // tell path generator to use albersUsa projection

    var svg2 = d3.select("#graph")

    var schools;
    var conferences = {};

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
    var revScale;
    var expScape;
    var d = 1000;


    d3.csv("Schools.csv", mutateRow, function(data) {
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
    	drawGraph();
   	});

   	// Turns the data into numbers from the csv file
   function mutateRow(row) {
	    row['lat'] = Number(row['lat']);
	    row['long'] = Number(row['long']);
	    row['rev'] = Number(row['rev']);
	    row['exp'] = Number(row['exp']);
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
         .data(states)
         //enter links the data up with the "path"
         .enter()
         .append("path")
         .attr("d", path)
         //map styles
         .style("opacity", "1")
         .style("stroke", "gray")
		.style("stroke-width", "1")
		.style("fill", "white")
		.attr("class","state")

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
          return revScale(d.rev);
         })
         .style("fill", function(d){
            return colorKey[d.conf]
         ;})
         .style("opacity", .6)
         .attr("class", "schoolCircle")
         .on("mouseover",handleMouseover)
         .on("mouseout",handleMouseout)
         .on("click",handleClick)

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
}

	function handleMouseover(d,i){
        d3.select("#tooltip")
            .style("left", (d3.event.pageX) + 20 + "px")
            .style("top", (d3.event.pageY) - 30 + "px")
            .select("#value")
            .text(d.school);
        d3.select('#conference')
            .text(d.conf);
        d3.select('#name')
            .text(d.school);
        d3.select('#expenses')
            .text("$" + formatNumber(d.exp));
        d3.select('#revenue')
            .text("$" + formatNumber(d.rev));
        d3.select("#tooltip").classed("hidden", false);
             
	}

	function handleMouseout(d,i){
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

	function createCoordinatesConferences(width,height){
		numTeamsinRow = Math.floor((width / (spacingBetweenTeamsX)) - 1)
		schools.sort(function(a,b){
			if (a.conf > b.conf){
				return 1;
			} else {
				return -1;
			}
		});
		var conf;
		var count = -1;
		var rowCount = -1;		
		schools.forEach(function(school,index){
			if (school.conf == conf){
				count += 1;
				if (count > numTeamsinRow){
					count = 0;
					rowCount += 1;
				}
			} else {
				count = 0;
				rowCount += 1;
			}
			school.x = padding + count * spacingBetweenTeamsX
			school.y = padding + rowCount * spacingBetweenTeamsY
			conf = school.conf
		})
	}

	function createCoordinatesSorted(width,height,v){
		numTeamsinRow = Math.floor((width / (spacingBetweenTeamsX)) - 1)
		schools = schools.sort(function(a,b){
			if (a[v] < b[v]){
				return 1;
			} else {
				return -1;
			}
		});
		var count = -1;
		var rowCount = 0;
		schools.forEach(function(school,index){
			if (count >= numTeamsinRow){
				count = 0;
				rowCount += 1;
			} else {
				count += 1;
			}
			school.x = padding + count * spacingBetweenTeamsX
			school.y = padding + rowCount * spacingBetweenTeamsY
		})
	}

function transitionMap(){
	document.getElementById("show_conferences").classList.remove("selected")
	document.getElementById("show_map").classList.add("selected")
	document.getElementById("show_sorted").classList.remove("selected")
	svg2.selectAll(".schoolCircle").transition().duration(d)
         .attr("cx", function(d){
            return projection([d.long,d.lat])[0];
         })
         .attr("cy", function(d){
            return projection([d.long,d.lat])[1];
         })
         .style("opacity", .6)

    svg2.selectAll(".schoolLabel").transition().duration(d)
         .attr("x", function(d){
            return projection([d.long,d.lat])[0];
         })
         .attr("y", function(d){
            return projection([d.long,d.lat])[1] - 10;
         })
         .style("opacity", 0)
         .style("font-size", '10pt')

    svg2.selectAll(".state").transition().duration(d)
    	.style('opacity',1)

    svg2.selectAll(".backArrow").transition().duration(d)
    	.style('opacity',0)
}

function transitionGrid(){
	console.log('hi')
	svg2.selectAll(".schoolCircle").transition().duration(d)
         .attr("cx", function(d){
            return d.x;
         })
         .attr("cy", function(d){
            return d.y;
         })
         .style("opacity", .6)

    svg2.selectAll(".schoolLabel").transition().duration(d)
         .attr("x", function(d){
            return d.x
         })
         .attr("y", function(d){
            return d.y - 20;
         })
         .style("opacity", 1)
         .style("font-size", '10pt')

    svg2.selectAll(".state").transition().duration(d)
    	.style('opacity',0)

    svg2.selectAll(".backArrow").transition().duration(d)
    	.style('opacity',0)
}

function transitionCircles(variable){
	svg2.selectAll(".schoolCircle").transition().duration(d)
         .attr("r", function(d){
            if (variable == 'rev'){
            	return revScale(d[variable]);
            } else {
            	return expScale(d[variable]);
            }
         })
} 

function transitionConferences(){
		document.getElementById("show_conferences").classList.add("selected")
		document.getElementById("show_map").classList.remove("selected")
		document.getElementById("show_sorted").classList.remove("selected")
		createCoordinatesConferences(w,h);
		if (document.getElementById("sort_rev").classList.contains("selected")){
			transitionGrid('rev');
		} else {
			transitionGrid('exp');
		}
}

function transitionSorted(){
	document.getElementById("show_conferences").classList.remove("selected")
	document.getElementById("show_map").classList.remove("selected")
	document.getElementById("show_sorted").classList.add("selected")
	if (document.getElementById("sort_rev").classList.contains("selected")){
		createCoordinatesSorted(w,h,'rev');
	} else {
		createCoordinatesSorted(w,h,'exp');
	}
	transitionGrid();
}

function transitionRev(){
	document.getElementById("sort_exp").classList.remove("selected")
	document.getElementById("sort_rev").classList.add("selected")
	transitionCircles('rev');
	if (document.getElementById("show_sorted").classList.contains("selected")){
		createCoordinatesSorted(w,h,'rev');
		setTimeout(transitionGrid, d);		
	}
}

function transitionExp(){
	document.getElementById("sort_rev").classList.remove("selected")
	document.getElementById("sort_exp").classList.add("selected")
	transitionCircles('exp');
	if (document.getElementById("show_sorted").classList.contains("selected")){
		createCoordinatesSorted(w,h,'exp');
		setTimeout(transitionGrid, d);		
	}
}

document.getElementById("show_conferences").addEventListener("click", function() {
    if (!document.getElementById("show_conferences").classList.contains("selected")){
    	transitionConferences();
    }
}, false);
document.getElementById("show_map").onclick = transitionMap
document.getElementById("show_sorted").onclick = transitionSorted
document.getElementById("sort_rev").onclick = transitionRev
document.getElementById("sort_exp").onclick = transitionExp