import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import ReactDOMServer from 'react-dom/server';
import Reactangle from './Reactangle';

const exampleData = {
  nodes: [
    { id: 'node1', name: 'Node 1', component: <Reactangle /> },
    { id: 'node2', name: 'Node 2', component: <div style={{ backgroundColor: 'blue', width: '100%', height: '100%' }}>Component 2</div> },
    { id: 'node3', name: 'Node 3', component: <div style={{ backgroundColor: 'green', width: '100%', height: '100%' }}>Component 3</div> },
    { id: 'node4', name: 'Node 4', component: <div style={{ backgroundColor: 'yellow', width: '100%', height: '100%' }}>Component 4</div> },
  ],
  links: [
    { source: 'node1', target: 'node2' },
    { source: 'node2', target: 'node3' },
    { source: 'node3', target: 'node4' },
    { source: 'node4', target: 'node1' },
  ],
};

const ArchDiag = ({ data = exampleData }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    // Get the width and height of the container
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create the SVG container
    const svg = d3.select(svgRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Set up the force simulation to position the nodes
    const simulation = d3.forceSimulation(data.nodes)
      .force('charge', d3.forceManyBody().strength(-500))
      .force('link', d3.forceLink(data.links).id((d) => d.id).distance(500))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Draw the links between the components
    const link = svg.selectAll('line')
      .data(data.links)
      .enter()
      .append('line')
      .attr('stroke', 'gray')
      .attr('stroke-width', 2);

    // Draw the components
    const component = svg.selectAll('.component')
      .data(data.nodes)
      .enter()
      .append('foreignObject')
      .attr('class', 'component')
      .attr('width', 120)
      .attr('height', 80)
      .html((d) => ReactDOMServer.renderToString(d.component));

    // Update the positions of the components and links on each tick of the simulation
    simulation.on('tick', () => {
      component.attr('x', (d) => d.x - 60)
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
  }, [data]);

  return (
    <div ref={svgRef} style={{ width: '100%', height:'500px' }} />
    );
};

export default ArchDiag;
