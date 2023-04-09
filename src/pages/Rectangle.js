import Barchart from './Barchart';

export default function Rectangle({ latencyData, appName, barData, router }) {
  const handleClick = () => {
    console.log('Clicked on rectangle');
    router.push('/serviceDetails');
  };

  return (
    <div
      style={{ width: 70, height: 50, border: '1px solid black' }}
      onClick={() => handleClick()}
    >
      <Barchart
        width={70}
        height={15}
        barColor="blue"
        barData={barData}
        label="Request rate over last hour"
      />
      <Barchart
        width={70}
        height={15}
        barColor="red"
        barData={latencyData}
        label="Latencies over last hour"
      />
    </div>
  );
}
