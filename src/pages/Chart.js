import * as React from "react";
import * as d3 from "d3";

function drawChart(svgRef) {
    const container = d3.select("svg#svg");

    const data = [2, 1, 1, 1, 1, 1, 1];
    
    const dataTree = {
        id: 'root',
        size: 12,
        children: data.map(function (d) {
            return {
                size: 10,
                parent: "root"
            };
        })
    };
    
    const maxRadius = 50;
    const padding = 40;
    const radiusScale = d3.scaleSqrt()
        .domain([0, 50 /* d3.max(data) */ ])
        .range([0, 50]); // maxRadius
    
    const roughCircumference = d3.sum(data.map(radiusScale)) * 2 + padding * (data.length - 1);
    const radius = roughCircumference / (Math.PI * 2);
    
    // console.log(d3.tre)
    // make a radial tree layouts
    const tree = d3.tree()
        .size([360, radius])
        .separation(function (a, b) {
        return radiusScale(a.size) + radiusScale(b.size);
    });
    
    // create a holder group for all the graph nodes
    const svgGroup = container.append('g')
        .attr('transform', 'translate(' + 80 + ',' + 90 + ')');
    
    
    // console.log(tree(dataTree));
    // const nodes = tree.nodes(dataTree);
    // const links = tree.links(nodes); // and then... ?
    
    // // declare the nodes (this creates placed groups)
    // const svgNodes = svgGroup.selectAll('.node')
    //     .data(nodes) // cut out the root node, we don't need it : nodes.slice(1)
    // .enter().append('g')
    //     .attr('class', 'node')
    //     .attr('transform', function (d) {
    //     return "rotate(" + (d.x - 90) + ") translate(" + d.y + ")";
    // });
    
    // // append a cirl to all nodes groups
    // svgNodes.append('circle').attr('r', function (d) {
    //     return d.size;
    // });
}

const Chart = () => {
  const svg = React.useRef(null);
  React.useEffect(() => {
    drawChart(svg);
  }, [svg]);

  return (
    <div id="chart">
      <svg id="svg"></svg>
    </div>
  );
};

export default Chart;
