import * as d3 from 'd3';
function DonutChart(id, day, week) {
    const width = 1200,
          height = 450,
          margin = 40;
    const totalDay = d3.sum(Object.values(day));
    const totalWeek = d3.sum(Object.values(week));
    // Remove any previous SVGs
    d3.select(id).select("svg").remove();

    // Create a single SVG container
    const svg = d3.select(id)
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    
    
    // Set up the color scale
    const color = d3.scaleOrdinal().range(d3.schemeTableau10);
    const pie = d3.pie().value(d => d[1]);
    const radius = Math.min(width, height) / 2 - margin;
    const textArc = d3.arc()
    .innerRadius(radius * 0.7) // Adjust as needed for label positioning
    .outerRadius(radius * 0.7);
    // Define the arc generator
    const arcGenerator = d3.arc()
        .innerRadius(50) // This is the size of the donut hole
        .outerRadius(radius);

    // Create the 'day' donut chart
    const dayGroup = svg.append("g")
        .attr("transform", `translate(${width / 4},${height / 2})`);

    const dayDataReady = pie(Object.entries(day));
    dayGroup.selectAll('path')
        .data(dayDataReady)
        .join('path')
        .attr('d', arcGenerator)
        .attr('fill', d => color(d.data[0]))
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7);
    // dayGroup.selectAll('text')
    //     .data(dayDataReady)
    //     .join('text')
    //     .attr("transform", d => `translate(${textArc.centroid(d)})`)
    //     .attr("dy", "0.35em") // Centers the text on the line
    //     .attr("text-anchor", "middle") // Centers the text in the middle of the arc
    //     .text(d => d.data[0]);
    dayGroup.selectAll('text')
        .data(dayDataReady)
        .join('text')
        .attr("transform", d => `translate(${textArc.centroid(d)})`)
        .attr("text-anchor", "middle") // Centers the text in the middle of the arc
        .each(function(d) {
            var el = d3.select(this);
            el.append('tspan')
                .attr("dy", "-0.6em") // Adjust position of the first line
                .text(d.data[0]);
            el.append('tspan')
                .attr("dy", "1.2em") // Adjust position for the second line
                .attr("x", 0) // Reset x position for the tspan element
                .text(`${(d.data[1] / totalDay * 100).toFixed(1)}%`); // Formats to 1 decimal place
        });
    // Create the 'week' donut chart
    const weekGroup = svg.append("g")
        .attr("transform", `translate(${width * 3 / 4},${height / 2})`);

    const weekDataReady = pie(Object.entries(week));
    weekGroup.selectAll('path')
        .data(weekDataReady)
        .join('path')
        .attr('d', arcGenerator)
        .attr('fill', d => color(d.data[0]))
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7);
//     weekGroup.selectAll('text')
//         .data(weekDataReady)
//         .join('text')
//         .attr("transform", d => `translate(${textArc.centroid(d)})`)
//         .attr("dy", "0.3em") // Centers the text on the line
//         .attr("text-anchor", "middle") // Centers the text in the middle of the arc
//         .text(d => d.data[0]);
     
    // weekGroup.selectAll('text')
    // .data(weekDataReady)
    // .join('text')
    // .attr("transform", d => `translate(${textArc.centroid(d)})`)
    // .attr("dy", "0.3em") // Centers the text on the line
    // .attr("text-anchor", "middle") // Centers the text in the middle of the arc
    // .text(d => `${d.data[0]}: ${(d.data[1] / totalWeek * 100).toFixed(1)}%`); // Formats to 1 decimal place
    weekGroup.selectAll('text')
    .data(weekDataReady)
    .join('text')
    .attr("transform", d => `translate(${textArc.centroid(d)})`)
    .attr("text-anchor", "middle") // Centers the text in the middle of the arc
    .each(function(d) {
        var el = d3.select(this);
        el.append('tspan')
            .attr("dy", "-0.6em") // Adjust position of the first line
            .text(d.data[0]);
        el.append('tspan')
            .attr("dy", "1.2em") // Adjust position for the second line
            .attr("x", 0) // Reset x position for the tspan element
            .text(`${(d.data[1] / totalWeek * 100).toFixed(1)}%`); // Formats to 1 decimal place
    });
}

export default DonutChart;