import React, { useEffect, useState } from 'react';

import { Inter } from '@next/font/google'
import { getTraces } from '@/utils/jaeger';
import ArcDiagram from './ArcDiagram';
import TraceFlamegraph from './TraceFlamegraph';
import LineChart from './LineChart';

const inter = Inter({ subsets: ['latin'] })

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
        {/* <LineChart/> */}
      </div>
    </>
  )
}
