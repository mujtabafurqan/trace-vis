import React, { useEffect } from "react";
import * as d3 from "d3";
import Reactangle from "./Reactangle";

function drawChart(){
    var data = {"name": "A", "children": [
        {"name": "C"},
        {"name": "D", "children": [
            {"name": "F"},
            {"name": "E"}
        ]},
        {"name": "B"}
    ]};

    var root = d3.hierarchy(data)
        .sort((a,b) => b.height - a.height || a.data.name.localeCompare(b.data.name));

    var treeLayout = d3.tree()
        .size([580, 80]);

    treeLayout(root);

    var svg = d3.select("#demo1");

    svg.select('g.links')
        .selectAll('line.link')
        .data(root.links())
        .enter()
        .append('line')
        .attr('x1', function(d) {return d.source.x;})
        .attr('y1', function(d) {return d.source.y;})
        .attr('x2', function(d) {return d.target.x;})
        .attr('y2', function(d) {return d.target.y;})
        .attr('stroke', "darkgray")
        .attr('stroke-width', 2);

    // svg.select('g.nodes')
    //     .selectAll('circle.node')
    //     .data(root.descendants())
    //     .enter()
    //     .append('rect')
    //     .attr('x', function(d) {return d.x;})
    //     .attr('y', function(d) {return d.y;})
    //     .attr('width', 100)
    //     .attr('height', 100)
    //     .attr("fill", "lightblue")
    //     .attr('stroke', "darkgray")
    //     .attr('stroke-width', 1);


        svg.select('g.nodes')
        .selectAll('circle.node')
        .data(root.descendants())
        .enter()
        .append('foreignObject')
        .attr('x', function(d) {return d.x;})
        .attr('y', function(d) {return d.y;})
        .attr("width", 480)
        .attr("height", 500)
        // .append("xhtml:div")
        .style("font", "2px 'Helvetica Neue'")
        .html((d) => {
            <Reactangle />
        });

}


export default function Demo() {

    useEffect(() => {
        drawChart();
      }, []);
    

    return (
        <svg id="demo1" width={1000} height={1000}>
            <g transform="translate(100,100)">
                <g className="links"></g>
                <g className="nodes"></g>
            </g>
        </svg>

    );
}