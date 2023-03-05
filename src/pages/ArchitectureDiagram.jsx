import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function ArchitectureDiagram() {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;

    const data = {
      nodes: [
        { id: "node1", label: "Node 1", x: 100, y: 100, width: 100, height: 50 },
        { id: "node2", label: "Node 2", x: 300, y: 100, width: 100, height: 50 },
        { id: "node3", label: "Node 3", x: 200, y: 250, width: 100, height: 50 }
      ],
      links: [
        { source: "node1", target: "node2" },
        { source: "node2", target: "node3" },
        { source: "node3", target: "node1" }
      ]
    };

    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.selectAll(".link")
      .data(data.links)
      .enter().append("line")
      .attr("class", "link");

    const node = svg.selectAll(".node")
      .data(data.nodes)
      .enter().append("rect")
      .attr("class", "node")
      .attr("width", d => d.width)
      .attr("height", d => d.height);

    node.append("title")
      .text(d => d.label);

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("x", d => d.x - d.width / 2)
        .attr("y", d => d.y - d.height / 2);
    });
  }, []);

  return (
    <svg ref={svgRef} width="800" height="600"></svg>
  );
}