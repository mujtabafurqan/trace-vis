import React from 'react';
import { FlamegraphRenderer, convertJaegerTraceToProfile } from '@pyroscope/flamegraph';

import '@pyroscope/flamegraph/dist/index.css';
// import './index.css';

const TraceFlamegraph = ({ trace }) => {
  console.log("traceFlamegraph",trace)
  const convertedProfile = trace && trace.data ? convertJaegerTraceToProfile(trace.data[0]) : null;
  console.log("convertedProfile",convertedProfile);
  return (
    <div className="Flamegraph-wrapper">
      <FlamegraphRenderer colorMode="light" profile={convertedProfile} />
    </div>
  );
};

export default TraceFlamegraph;