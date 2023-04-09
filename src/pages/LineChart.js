import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const data = [
    { date: new Date("2022-03-01T00:00:00Z"), value: 100 },
    { date: new Date("2022-03-02T00:00:00Z"), value: 200 },
    { date: new Date("2022-03-03T00:00:00Z"), value: 150 },
    { date: new Date("2022-03-04T00:00:00Z"), value: 300 },
    { date: new Date("2022-03-05T00:00:00Z"), value: 250 },
    { date: new Date("2022-03-06T00:00:00Z"), value: 350 },
    { date: new Date("2022-03-07T00:00:00Z"), value: 400 }
  ];

  
  const LineChart = ({width = 800, height = 400 }) => {
    const svgRef = useRef();
  
    useEffect(() => {
      const createChart = () => {
        const margin = { top: 20, right: 20, bottom: 30, left: 50 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
  
        const svg = d3.select(svgRef.current);
  
        const x = d3
          .scaleTime()
          .domain(d3.extent(data, (d) => d.timestamp))
          .range([0, innerWidth]);
  
        const y = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d.requests)])
          .range([innerHeight, 0]);
  
        const xAxis = d3.axisBottom(x).ticks(6);
        const yAxis = d3.axisLeft(y).ticks(6);
  
        svg
          .append('g')
          .attr('transform', `translate(0,${innerHeight})`)
          .call(xAxis);
  
        svg.append('g').call(yAxis);
  
        const line = d3
          .line()
          .x((d) => x(d.timestamp))
          .y((d) => y(d.requests));
  
        svg
          .append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', 'steelblue')
          .attr('stroke-width', 1.5)
          .attr('d', line);
      };
  
      createChart();
    }, [data, height, width]);
  
    return (
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ border: '1px solid black' }}
      />
    );
  };
  
  export default LineChart;