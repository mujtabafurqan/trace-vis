import Barchart from './Barchart';

export default function Rectangle({ latencyData, appName, barData, router, width = 70, height = 30 }) {
  const handleClick = () => {
    console.log('Clicked on rectangle');
    router.push('/serviceDetails');
  };

  return (
    <div
      style={{ width: width, height: height+20, border: '1px solid black' }}
      onClick={() => handleClick()}
    >
      <Barchart
        width={width}
        height={height/2}
        barColor="blue"
        barData={barData}
        label="Request rate over last hour"
      />
      <Barchart
        width={width}
        height={height/2}
        barColor="red"
        barData={latencyData}
        label="Latencies over last hour"
      />
    </div>
  );
}
