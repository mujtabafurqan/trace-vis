import * as d3 from 'd3';
import { color } from 'd3';

// const data = [12, 30, 45, 23, 50, 29];

const Barchart = ({width=400, height=400, barColor='black', appName, barData, label}) => {

    if(barData == null || barData.length === 0){
        return <div></div>
    }
    const x = d3.scaleBand()
        .domain(d3.range(barData.length))
        .range([0, width])
        .padding(0.1);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(barData)])
        .range([height, 0]);
    
    return (
        <div>
            <p style={{color:'black', fontSize:'5px', padding:'0px'}}>{label}</p>
            <svg width={width} height={height}>
            {barData.map((d, i) => (
                <rect key={i} x={x(i)} y={y(d)} width={x.bandwidth()} height={height - y(d)} fill={barColor} />
            ))}
            </svg>
            
        </div>
    );
    
}

export default Barchart;