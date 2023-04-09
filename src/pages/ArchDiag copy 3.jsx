import React, { useRef } from 'react';
import * as d3 from 'd3';
import ReactDOMServer from 'react-dom/server';
import Rectangle from './Reactangle';

const exampleData = {
  nodes: [
    { id: 'node1', name: 'Node 1', component: <Rectangle /> },
    { id: 'node2', name: 'Node 2', component: <div style={{ backgroundColor: 'blue', width: '100%', height: '100%' }}>Component 2</div> },
    { id: 'node3', name: 'Node 3', component: <div style={{ backgroundColor: 'green', width: '100%', height: '100%' }}>Component 3</div> },
    { id: 'node4', name: 'Node 4', component: <div style={{ backgroundColor: 'yellow', width: '100%', height: '100%' }}>Component 4</div> },
    { id: 'node5', name: 'Node 5', component: <Rectangle /> },
  ],
  links: [
    { source: 'node1', target: 'node2' },
    { source: 'node2', target: 'node3' },
    { source: 'node3', target: 'node4' },
    { source: 'node4', target: 'node1' },
    { source: 'node5', target: 'node1' },
    { source: 'node3', target: 'node5' },

  ],
};

const createSvg = (container,data, width, height) => {
    const svg = d3.select(container).append("svg").attr("width", width).attr("height", height);
  
    const linksGroup = svg.append("g");
    const componentsGroup = svg.append("g");

    // Set up the force simulation to position the nodes
    const simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(data.links).id((d) => d.id).distance(200))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2));

    // Draw the links between the components
    const link = linksGroup
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
    .attr("stroke", "gray")
    .attr("stroke-width", 2)
    .attr("marker-end", "url(#arrowhead)");

    const arrowhead = svg
      .append("svg:defs")
      .append("svg:marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 8)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z");

  const component = componentsGroup
    .selectAll(".component")
    .data(data.nodes)
    .enter()
    .append("foreignObject")
    .attr("class", "component")
    .attr("width", 150)
    .attr("height", 90)
    .html((d) => ReactDOMServer.renderToString(d.component))
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );


    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Update the positions of the components and links on each tick of the simulation
    simulation.on('tick', () => {
      component.attr('x', (d) => {
        return (d.x - 60)})
        .attr('y', (d) => d.y - 40);

      link.attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);
    });

    // Clean up the simulation when the component is unmounted
    return () => {
      simulation.stop();
    };
}

const ArchDiag = ({ data = exampleData, width = 700, height = 430 }) => {
  const svgRef = useRef();

  React.useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();
    createSvg(svgRef.current, data, width, height);
  }, [data, width, height]);

  return <div ref={svgRef} />;
};

export default ArchDiag;
