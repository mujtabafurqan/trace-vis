import React, { useRef, useState } from 'react';
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
      component: <Rectangle latencyData={latencyData} appName={services.data[i]} barData={barData} height={50}/>,
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

const createSvg = async (container, data, width, height, router, setShowPopup, showPopup, setPopupData) => {
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

        const dummyData = data;

        console.log("D3 Json",dummyData);
        // List of node names
        var allNodes = dummyData.nodes.map(function(d){return d.name})

        // A linear scale to position the nodes on the X axis
        var x = d3.scalePoint()
            .range([0, height*0.7])
            .domain(allNodes)

        // Add the circle for the nodes
        svg
            .selectAll("mynodes")
            .data(dummyData.nodes)
            .enter()
            .append("foreignObject")
            .attr("x", (width/2)-500)
            .attr("y", function(d){ return(x(d.name))})
            .attr("class", "component")
            .attr("width", 70)
            .attr("height", 52)
            .attr("class", "component cursor-pointer")
            .html((d) => ReactDOMServer.renderToString(d.component))
            .on("click", async function(d, i) {
              
              const latencyData  = await getLatenciesLastHourBarChart(i.id);
              const barData = await getRequestsLastHourBarChart(i.id);
              const appName = i.id;
              setPopupData({latencyData, barData, appName});
              setShowPopup(!showPopup);
            })
            

        // And give them a label
        svg
            .selectAll("mylabels")
            .data(dummyData.nodes)
            .enter()
            .append("text")
            .attr("x", 100)
            .attr("y", function(d){ return((x(d.name)))+30})
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
  

const ArcDiagram = ({ data ={}, width = 1200, height = 1500 }) => {
  const router = useRouter();
  const svgRef = useRef();
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({});

  const closePopup = () => {
    setShowPopup(false);
  }

  const exploreClick = () => {
    router.push(`/service/${popupData.appName}`);
  }

  React.useEffect(() => {    
    const constructSVG = async () =>{
      data.nodes = await getNodes();
      data.links = await getLinks();
      console.log("In Use Effect",data);

      d3.select(svgRef.current).selectAll("*").remove();
      createSvg(svgRef.current, data, width, height, router , setShowPopup, showPopup, setPopupData);
    }

    constructSVG();
  }, []);

  return (
    <div>
      <div className="flex">
        <div className='w-5/6'>
          <svg
            ref={svgRef}
            width={width}
            height={height}
            className="mx-auto"
            viewBox={`0 0 ${width} ${height}`}
          >
          </svg>
        </div>
        <div className='flex justify-center items-center w-1/6 h-full py-50'>
          <div className="absolute top-0 right-0 mt-4 mr-4 flex flex-col gap-2">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-800 mr-2"></div>
              <span className="text-sm">Request Rate Over last One Hour</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-600 mr-2"></div>
              <span className="text-sm">Latencies Over last One Hour</span>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`fixed top-0 left-0 w-full h-full bg-clear bg-opacity-50 flex justify-center items-center transition-opacity ${
          showPopup ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-md p-4">
          <h2 className="text-lg font-bold mb-2">{popupData.appName}</h2>
          {/* <p className="text-gray-700">Popop</p> */}
            <Rectangle latencyData={popupData.latencyData} appName={popupData.appName} barData={popupData.barData} width={350} height={200} />
          <div>
            <button className="bg-blue-500 text-white px-10 py-2 rounded-md mt-4 mx-8" onClick={closePopup}>Close</button>
            <button className="bg-blue-500 text-white px-10 py-2 rounded-md mt-4" onClick={exploreClick}>Explore</button>
          </div>
        </div>
      </div>
    </div> 
  )
};

export default ArcDiagram;