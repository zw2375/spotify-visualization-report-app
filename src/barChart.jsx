import * as d3 from 'd3';
function BarChart(id, data) {
    const width = 1000,
          height = 450,
          margin = 40;

    // Remove any previous SVGs
    d3.select(id).selectAll("svg").remove();
    d3.select(id).selectAll("div").remove();

    // Create a single SVG container
    const svg = d3.select(id)
    .append("svg")
      .attr("width", width +2* margin )
      .attr("height", height +2* margin)
    .append("g")
      .attr("transform", `translate(${margin},0)`);
  
    var tooltip = d3.select(id).append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);
    const maxY = d3.max(data, d => d.value);
    // Set up the color scale
    const color = d3.scaleOrdinal().range(d3.schemeTableau10);
    // X axis
    const x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(d => d.time))
    .padding(0.2);
    svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear()
    .domain([0, maxY])
    .range([ height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));

    // Bars
    svg.selectAll("mybar")
    .data(data)
    .join("rect")
    .attr("x", d => x(d.time))
    .attr("y", d => y(d.value))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.value))
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .attr("fill", "#69b3a2")
    .on("mouseover", function(event, d) {
      return tooltip.html(d.value)
      .style("left", (event.pageX + 15) + "px")
      .style("top", (event.pageY + 15) + "px")
      .style("opacity", 1)
  })
  .on("mouseout", function(d,i){
   

    tooltip.transition()    
      .duration(500)    
      .style("opacity", 0); 

  
})
}

export default BarChart;