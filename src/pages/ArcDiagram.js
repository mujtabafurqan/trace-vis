import React, { useRef } from 'react';
import * as d3 from 'd3';
import ReactDOMServer from 'react-dom/server';
import Rectangle from './Rectangle';
import { useRouter} from 'next/router';
import { getDependencies, getServices, getRequestsLastHour, getRequestsLastHourBarChart, getLatenciesLastHourBarChart } from '@/utils/jaeger';

const getNodes = async () => {
  const services = await getServices();
  const nodes = [];
  for(let i = 0; i < services.data.length; i++){
    // const lineData = await getRequestsLastHour(services.data[i]);
    const barData = await getRequestsLastHourBarChart(services.data[i]);
    const latencyData = await getLatenciesLastHourBarChart(services.data[i]);
    console.log("latencyData",latencyData);
    console.log("barData",barData);
    nodes.push({
      id: services.data[i],
      name: services.data[i],
      component: <Rectangle latencyData={latencyData} appName={services.data[i]} barData={barData}/>,
    });
  }
  return nodes;
}

const getLinks = async () => {
  const dependencies = await getDependencies();
  const links = [];
  for(let i = 0; i < dependencies.data.length; i++){
    links.push({
      source: dependencies.data[i].parent,
      target: dependencies.data[i].child,
    });
  }
  return links;
}

const createSvg = async (container, data, width, height, router) => {
    var margin = {top: 20, right: 30, bottom: 20, left: 30},
        width = height - margin.left - margin.right,
        height = width - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select(container)
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Read dummy data
        // const dummyData = await d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_network.json")
        const dummyData = data;

        console.log("D3 Json",dummyData);
        // List of node names
        var allNodes = dummyData.nodes.map(function(d){return d.name})

        // A linear scale to position the nodes on the X axis
        var x = d3.scalePoint()
            .range([0, height])
            .domain(allNodes)

        // Add the circle for the nodes
        svg
            .selectAll("mynodes")
            .data(dummyData.nodes)
            .enter()
            .append("foreignObject")
            .attr("x", (width/2)-75)
            .attr("y", function(d){ return(x(d.name))*1.5})
            .attr("class", "component")
            .attr("width", 70)
            .attr("height", 50)
            .html((d) => ReactDOMServer.renderToString(d.component))
            .on("click", function(d, i) {
                router.push(`/service/${i.id}`);
            })

        // And give them a label
        svg
            .selectAll("mylabels")
            .data(dummyData.nodes)
            .enter()
            .append("text")
            .attr("x", 130)
            .attr("y", function(d){ return((x(d.name))*1.5)+30})
            .text(function(d){ return(d.name)})
            .style("text-anchor", "middle")

        // Add links between nodes. Here is the tricky part.
        // In my input data, links are provided between nodes -id-, NOT between node names.
        // So I have to do a link between this id and the name
        var idToNode = {};
        dummyData.nodes.forEach(function (n) {
            idToNode[n.id] = n;
        });
        // Cool, now if I do idToNode["2"].name I've got the name of the node with id 2

        // Add the links
        svg.selectAll('mylinks')
            .data(dummyData.links)
            .enter()
            .append('path')
            .attr('d', function (d) {
                const start = x(idToNode[d.source].name)    // Y position of start node on the Y axis
                const end = x(idToNode[d.target].name)      // Y position of end node
                return ['M', 290, start+30,    // the arc starts at the coordinate x=30, y=start (where the starting node is)
                        'A',                            // This means we're gonna build an elliptical arc
                        (end - start)/2, ',',    // Next 2 lines are the coordinates of the inflexion point. Width of this point is proportional with end - start distance
                        (end - start)/2, 0, 0, ',',
                        start < end ? 1 : 0, 290, ',', end+30] // We always want the arc on left. So if end is before start, putting 0 here turn the arc to the left.
                        .join(' ');
            })
            .style("fill", "none")
            .attr("stroke", "black")

      }
  

const ArcDiagram = ({ data ={}, width = 1100, height = 650 }) => {
  const router = useRouter();
  const svgRef = useRef();

  React.useEffect(() => {

    const constructSVG = async () =>{
      data.nodes = await getNodes();
      data.links = await getLinks();
      console.log("In Use Effect",data);

      d3.select(svgRef.current).selectAll("*").remove();
      createSvg(svgRef.current, data, width, height, router);
    }

    constructSVG();
  }, []);

  return <div id="arcDiag" ref={svgRef} />;
};

export default ArcDiagram;