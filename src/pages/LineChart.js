import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LineGraph = ({ data, width, height }) => {
  const svgRef = useRef();
  useEffect(() => {
    console.log("In useEffect",data)
    if(data != null){
        const svg = d3.select(svgRef.current);
        console.log("Linedata",data)
        // Set up scales for the x and y axis
        const xScale = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.date))
        .range([0, width]);
        const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value)])
        .range([height, 0]);

        // Set up axis for the x and y axis
        const xAxis = d3.axisTop().scale(xScale).ticks(10).tickFormat(d3.timeFormat('%I:%M %p'));
        const yAxis = d3.axisRight().scale(yScale).ticks(10);


        svg.selectAll('.tick line').attr('stroke', 'lightgray'); // Change the color of the tick marks
        svg.selectAll('.tick text').attr('fill', 'gray'); // Change the color of the tick labels
        // Add the x-axis to the svg
        svg
        .select('.x-axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis);

        // Add the y-axis to the svg
        svg.select('.y-axis').call(yAxis);

        // Draw the line for the graph
        const line = d3
        .line()
        .x((d) => xScale(d.date))
        .y((d) => yScale(d.value));

        svg
        .select('.line')
        .datum(data)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2);

        // Add labels to the x and y axis
        svg
        .append('text')
        .attr('class', 'x label')
        .attr('text-anchor', 'end')
        .attr('x', width)
        .attr('y', height + 40)
        .text('Date');

        svg
        .append('text')
        .attr('class', 'y label')
        .attr('text-anchor', 'end')
        .attr('y', -50)
        .attr('dy', '.75em')
        .attr('transform', 'rotate(-90)')
        .text('Value');

    }
  }, [data, height, width]);

  return (
    <svg width={width} height={height} ref={svgRef}>
      <g className="x-axis" />
      <g className="y-axis" />
      <path className="line" />
    </svg>
  );
};

export default LineGraph;
