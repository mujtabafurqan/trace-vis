import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { getTraces20, getRequestsLastHourLineChart,getLatenciesLastHourLineChart} from '@/utils/jaeger';
import { useRouter } from 'next/router';
import TraceFlamegraph from '../TraceFlamegraph';
import LineChart from '../LineChart';
const Service = () => {
  const router = useRouter();
  const { serviceName } = router.query;
  const [items, setItems] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [requestsLineData, setRequestsLineData] = useState([]);
  const [latenciesLineData, setLatenciesLineData] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const response2 = await getRequestsLastHourLineChart(serviceName)
      if(response2 != null)
        setRequestsLineData(response2);
      const response = await getTraces20(serviceName)
      if(response != null)
        setItems(response.data);
      const response3 = await getLatenciesLastHourLineChart(serviceName)
      if(response3 != null)
        setLatenciesLineData(response3);
    };
    fetchItems();
  }, []);

  const convertMstoS = (ms) => {
    return ms/1000000;
  }

  return (
    <>
      <Head>
        <title>{ serviceName }</title>
      </Head>
      <div class="flex flex-col">
        <div class="flex p-10">
            <div class="px-5 w-650 h-450">
                <h1 class="text-xl font-semibold px-10">Request Rate Last hour</h1>
                <LineChart data={requestsLineData} width={600} height={400} margin={{ top: 20, right: 30, bottom: 30, left: 40 }} />
            </div>

            <div class="px-5">
                <h1 class="text-xl font-semibold px-10">Latencies Last hour</h1>
                <LineChart data={latenciesLineData} width={600} height={400} margin={{ top: 20, right: 30, bottom: 30, left: 40 }} />
            </div>

        </div>

        <div class="mt-32">
            <div class="px-4 sm:px-8 max-w-10xl m-auto">
            <h1 class="text-center font-semibold text-sm">{serviceName}'s Last 20 Traces</h1>
            <ul class="border border-gray-200 rounded overflow-hidden shadow-md">
                {items.map((item, index) => (
                <li
                    key={item.traceID}
                    class="px-4 py-2 bg-white hover:bg-sky-100 hover:text-sky-900 border-b last:border-none border-gray-200 transition-all duration-300 ease-in-out"
                    onClick={() => setSelectedItemIndex(index)}
                >
                    {item.traceID}
                    {selectedItemIndex === index && <TraceFlamegraph trace={item} />}
                </li>
                ))}
            </ul>
            </div>
        </div>
      </div>
    </>
  );
};

export default Service;
