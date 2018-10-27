var usEducationData= "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json";

var usCountyData = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json";


 var width = 1050;
 var height = 800;

var svg = d3.select("svg")
            .attr("width", width )
            .attr("height", height);



var scale = d3.scaleLinear()
               .domain([1, 10])
               .rangeRound([600, 860]);

var color = d3.scaleThreshold()
            .domain([0, 10, 20, 30, 40, 50, 60, 70, 80])
    .range (['#b30000', '#fc8d59','#fef0d9','#a1d99b','#74c476','#41ab5d','#238b45','#006d2c','#004529']);


var tooltip = d3.select("body")
                .append("div")
                .style("opacity", 0.5)   
                .attr("id", "tooltip");

var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(420,35)");

var legend = g.selectAll(".legend")
              .data(color.range())
              .enter().append("g")
              .attr("id", "legend")
              .attr("width", width)
              .attr("height", 100);

var path = d3.geoPath();

d3.json(usCountyData, function(map) {
  var counties = topojson.feature(map, map.objects.counties).features;
  
  d3.json(usEducationData, function(data) {
  
    
    svg.append("g")
     .selectAll("path")
     .data(counties) 
     .enter()
     .append("path")
     .attr("class", "county")
     .attr("d", path)
     .attr("data-fips", (d) => d.id)
     .attr("data-education", (d) => {
      var outcome = data.filter((x) => x.fips == d.id)
      return outcome[0].bachelorsOrHigher
    })
     .style("fill", (d) => {
      var outcome  = data.filter((x) => x.fips == d.id)
      return color(outcome[0].bachelorsOrHigher)
    })
     .on("mouseover", (d) => {
          tooltip.style("opacity", 0.8)
                .style("left", (event.pageX + 28) + "px")
                .style("top", (event.pageY - 28) + "px")
                .attr("data-education", () => {
                     var outcome  = data.filter((x) => x.fips == d.id)
                     return outcome[0].bachelorsOrHigher
    })
                .html(() => {
      var outcome  = data.filter((x) => x.fips == d.id)
      return outcome[0].area_name + "</br> " + outcome[0].state + " </br>" + outcome[0].bachelorsOrHigher + "%"
    })   
                  
       })
       .on("mouseout", function(d) {
           tooltip.style("opacity", 0)
       });
      svg.append("path")
      .datum(topojson.mesh(map, map.objects.states, function(a, b) { return a !== b; }))
      .attr("class", "state-boundary")
  .attr('fill','none')
      .attr("d", path);
 

   
   var legendHeight = 20;
   var legendWidth = 50;
                   
 
    legend.append("rect")
            .attr("class", "legend")
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            .attr("x", (d, i) => i * legendWidth)
            .attr("y", 0)
            .style("fill", (d) => d);
    
    legend.append("text")
            .attr("x", (d, i) => i * legendWidth)
            .attr("y", 14)
            .attr("font-size", 11)
            .text((d, i) => {var x = 0; 
                             return x + i + "0%"
                            });
    
  });
});