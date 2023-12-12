import * as d3 from 'd3';
// import { schemeCategory20b } from 'd3-scale-chromatic';
import { schemeTableau10 } from 'd3-scale-chromatic';
import { event } from 'd3-selection';


function ClusterChart(id,new_data,emotionList){



var width = 1000
var height = 750
var leftmarg = 40
var padding = 40 // separation between same-color nodes
var clusterPadding = 60 // separation between different-color nodes
var maxRadius = 40
var minRadius = 5
var margin = { top: 10, left: 400, bottom: 10, right: 400 }
var topmarg = 280
d3.select(id).select("svg").remove();
var n = new_data.length, // total number of nodes
    m = 200; // number of distinct clusters
var drag = d3.drag()
.on("start", (event, d) => dragstarted(event, d))
.on("drag", (event, d) => dragged(event, d))
.on("end", (event, d) => dragended(event, d));
function dragstarted(event, d) {
  if (!event.active) force.alphaTarget(0.3).restart(); // Reheat the simulation
  d.fx = d.x; // Fix the position of the node
  d.fy = d.y;
}

function dragged(event, d) {
  d.fx = event.x; // Update the fixed position of the node
  d.fy = event.y;
}

function dragended(event, d) {
  if (!event.active) force.alphaTarget(0); // Cool down the simulation
  d.fx = null; // Unfix the position of the node
  d.fy = null;
}
var category20b = [
  "#B6DEC1", "#84C294", "#E4F0DA", "#E1BFA5",
  "#D06F78", "#C3829D", "#B26FB1", "#946198",
  "#9BC0E3", "#74A7DA", "#85AEB9", 
];
var color = d3.scaleOrdinal(category20b)
// var color = d3.scaleOrdinal(schemeTableau10)
    .domain(d3.range(m));

// The largest node for each cluster.
var clusters = new Array(m);


var div = d3.select("#clusterChart").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

if (new_data.length > 0) {
  var maxTotal = new_data.reduce((prev, current) => {
      return (prev["total"] > current["total"]) ? prev : current;
  });
  console.log(maxTotal);
  var radiusscale = d3.scaleLinear()
                  .domain([1, maxTotal.total])
                  .range([minRadius,maxRadius])
}else{
  
var radiusscale = d3.scaleLinear()
                .domain([1, 100])
                .range([minRadius,maxRadius])
  
  }


var nodes = d3.range(n).map(function(d,i) {
  var j = new_data[i]['typenum'],
      r = new_data[i]['total'],
      // d = {cluster: j, radius: radiusscale(r), name: new_data[i]['name']};
      d = {
        cluster: j,
        radius: radiusscale(r),
        name: new_data[i]['name'],
        genre: new_data[i]['type'], // Ensure you include this property if it exists in new_data
        aplays: r // Add aplays here if you need to reference it directly
      };
  if (!clusters[j] || (r > clusters[j].radius)) clusters[j] = d;
  return d;
});
var groupedData = d3.group(nodes, d => d.cluster);

var groupedEntries = Array.from(groupedData, ([key, value]) => ({ key, value }));

// Now create a hierarchy with the grouped data
var root = d3.hierarchy({ children: groupedEntries })
// var root = d3.hierarchy({ children: Array.from(groupedData.values()) })
    .sum(d => d.radius * d.radius) // adjust this according to your data structure
    ;
var packLayout = d3.pack()
.size([width * 0.9, height * 0.8])
.padding(padding)
;

packLayout(root).descendants();





var svg = d3.select("#clusterChart").append("svg")
    .attr("width", width+margin.left)
    .attr("height", height)
   ;

var clusterSeparationForce = d3.forceManyBody().strength(-0.2);
var has_clicked = false
var force = d3.forceSimulation(nodes) // Create a new force simulation with the specified nodes.
.force("charge", d3.forceManyBody().strength(-0.03)) // Use forceManyBody as a replacement for charge.
.force("center", d3.forceCenter(width / 2, height / 2)) // Center the nodes in the middle of the SVG.
.force("collision", d3.forceCollide((d) => d.radius+4)) // Prevent nodes from overlapping
.force("cluster", clusteringForce())
.force("clusterSeparation", clusterSeparationForce);
;
force.alphaDecay(0.01);
function clusteringForce() {
  let nodes;
  let strength = 0.1;

  function force(alpha) {
      // Calculate cluster force here.
      // For each node, find the cluster center and apply a force towards that center.
      const clusters = new Map();

      // Calculate the cluster centers
      nodes.forEach((d) => {
          const cluster = clusters.get(d.cluster);
          if (!cluster) clusters.set(d.cluster, { x: d.x, y: d.y, count: 1 });
          else {
              cluster.x += d.x;
              cluster.y += d.y;
              cluster.count += 1;
          }
      });

      clusters.forEach((cluster) => {
          cluster.x /= cluster.count;
          cluster.y /= cluster.count;
      });

      nodes.forEach((d) => {
          const cluster = clusters.get(d.cluster);
          const dx = cluster.x - d.x;
          const dy = cluster.y - d.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 1) { // Threshold to avoid extreme forces
              const force = (dist - d.radius) * strength * alpha;
              d.vx += (dx / dist) * force;
              d.vy += (dy / dist) * force;
          }
      });
     
  }

  force.initialize = (_) => nodes = _;

  force.strength = (_) => {
      strength = _ == null ? strength : _;
      return force;
  };

  return force;
}
var node = svg.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("id", function(d,i){
      return "circle_" + String(i);
    })
    .style("fill", function(d) { return color(d.cluster); })
    .on("mouseover", function(event, d) {
      
        
      var artist_plays = d.aplays === 1 ? " song" : " songs";

      return div.html(d.name + " (" + d.genre + ")<br/>" + 
       + d.aplays + artist_plays + "in your playlists <br/></br>")
      .style("left", (event.pageX + 15) + "px")
      .style("top", (event.pageY + 15) + "px")
      .style("opacity", 1)
   
  })

    .on("mouseout", function(d,i){
        // replace_text();

      if(has_clicked==false){
        // resetArtistPlays()  

        div.transition()    
          .duration(500)    
          .style("opacity", 0); 

        d3.selectAll(".play_box")
            .transition()
            .duration(0)
            .style("visibility", "hidden")


        d3.selectAll(".music_play")
            .transition()
            .duration(0)
            .style("visibility", "hidden")

      }
    })
    

node.transition()
    .duration(10)
    .delay(function(d, i) { return i * 1; })
    .attrTween("r", function(d) {
      var i = d3.interpolate(0, d.radius);
      return function(t) { return d.radius = i(t); };
    });



force.on("tick", tick)
  
// force.restart();
function tick() {
  var alpha = force.alpha(); 
  node
   .each(cluster(0.01*alpha * alpha))
    .each(collide(0.3))
    // .each(function(d) { return d.radius; })
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .call(drag);
}

// Move d to be adjacent to the cluster node.
function cluster(alpha) {
  return function(d) {
    var cluster = clusters[d.cluster];
    if (cluster === d) return;
    var x = d.x - cluster.x,
        y = d.y - cluster.y,
        l = Math.sqrt(x * x + y * y),
        r = d.radius + cluster.radius;
    if (l != r) {
      l = (l - r) / l * alpha;
      d.x -= x *= l;
      d.y -= y *= l;
      cluster.x += x;
      cluster.y += y;
    }
  };
}



// Resolves collisions between d and all other circles.
function collide(alpha) {
  // var quadtree = d3.geom.quadtree(nodes);
  var  quadtree = d3.quadtree()
    .x(d => d.x) // Replace 'd.x' with the actual property name for the x-coordinate in your nodes
    .y(d => d.y) // Replace 'd.y' with the actual property name for the y-coordinate in your nodes
    .addAll(nodes);
  return function(d) {
    var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}


var ping = svg.selectAll(".ping")
              .data([0])
              .enter();

    ping.append("circle")
      .attr("id", "ping")
      .attr("class", "ping")
      .attr("fill", "red")
      .attr("cx", 10)
      .attr("cy", 10)
      .attr("r", 5)
      .style("opacity", 0)

//////////// color explain tag //////////

	
var bars = svg.selectAll(".colorBar").data(emotionList)
.enter().append("g")
  .attr("transform", function(d, i) { return "translate("+(0)+"," + (10+i * 40) + ")"; })
bars.append("rect")
  .attr("width", 40)
  .attr("height", 20)
  .attr("fill",function(d,i) { 
    return category20b[i]; 
  });
bars.append("text")
  .attr("x", 40)
  .attr("y", 5)
  .attr("dy", ".35em")
  .text(function(d) { return d; });

  
}

export default ClusterChart;