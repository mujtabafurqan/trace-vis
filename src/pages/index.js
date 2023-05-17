import React, { useEffect, useState } from 'react';

import { Inter } from '@next/font/google'
import { getTraces } from '@/utils/jaeger';
import ArcDiagram from './ArcDiagram';
import Modal from './Modal';
import TraceFlamegraph from './TraceFlamegraph';
import LineChart from './LineChart';

const inter = Inter({ subsets: ['latin'] })

const data = [
  { date: new Date('2022-01-01'), value: 10 },
  { date: new Date('2022-02-01'), value: 20 },
  { date: new Date('2022-03-01'), value: 15 },
  { date: new Date('2022-04-01'), value: 25 },
  { date: new Date('2022-05-01'), value: 18 },
  { date: new Date('2022-06-01'), value: 22 },
];

export default function Home() {
  const [trace, setTrace] = useState(null);
  useEffect(() => {
    console.log("In useEffect",trace)
    const fetchTraceData = async () => {
      const response = await getTraces("cartservice", "2021-07-01T00:00:00.000Z", "2021-07-02T00:00:00.000Z")
      setTrace(response);
    };
    fetchTraceData();
  }, [])
  return (
    <>
      <div style={{background:'white', paddingLeft:'50px', height:'100vh'}}>
        {/* <ArchDiag /> */}
        {/* <TraceFlamegraph trace={trace} /> */}
        {/* <Barchart /> */}
        <ArcDiagram />
      </div>
    </>
  )
}
