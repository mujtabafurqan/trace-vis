import * as d3 from 'd3';

const data = [12, 30, 45, 23, 50, 29];

const Barchart = ({width=400, height=400, barColor='black', appName}) => {

    console.log("appName",appName);
    const x = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([0, width])
        .padding(0.1);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(data)])
        .range([height, 0]);
    
    return (
        <svg width={width} height={height}>
        {data.map((d, i) => (
            <rect key={i} x={x(i)} y={y(d)} width={x.bandwidth()} height={height - y(d)} fill={barColor} />
        ))}
        </svg>
    );
    
}

export default Barchart;