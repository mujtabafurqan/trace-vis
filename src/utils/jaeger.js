import axios from 'axios';

export async function getDependencies() {
  const jaegerUrl = 'http://localhost:8080/jaeger/ui/api/dependencies';
  try {
    const response = await axios.get(jaegerUrl);
    if (response.status === 200) {
      const data = response.data;
      console.log("Dependencies",data);
      return data;
    } else {
      console.error(`Failed to retrieve data from Jaeger. Status code: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Error retrieving data from Jaeger: ${error}`);
    return null;
  } 
}

export async function getServices() {
  const jaegerUrl = 'http://localhost:8080/jaeger/ui/api/services';
  try {
    const response = await axios.get(jaegerUrl);
    if (response.status === 200) {
      const data = response.data;
      return data;
    } else {
      console.error(`Failed to retrieve data from Jaeger. Status code: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Error retrieving data from Jaeger: ${error}`);
    return null;
  } 
}

export async function getTraces(serviceName, start, end) {

  const currentTimeInMicroseconds = Date.now() * 1000;
  const oneHourAgoInMicroseconds = currentTimeInMicroseconds - 60 * 60 * 1000 * 1000;
  console.log("oneHourAgoInMicroseconds",oneHourAgoInMicroseconds);

  const jaegerUrl = `http://localhost:8080/jaeger/ui/api/traces?end=${currentTimeInMicroseconds}&limit=1&lookback=1h&maxDuration&minDuration&service=${serviceName}&start=${oneHourAgoInMicroseconds}`;
  try {
    const response = await axios.get(jaegerUrl);
    console.log("Traces",response.data);
    if (response.status === 200) {
      const data = response.data;
      return data;
    } else {
      console.error(`Failed to retrieve data from Jaeger. Status code: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Error retrieving data from Jaeger: ${error}`);
    return null;
  } 
}


export async function getRequestsLastHourBarChart(service){
  const currentTimeInMicroseconds = Date.now() * 1000;
  const oneHourAgoInMicroseconds = currentTimeInMicroseconds - 60 * 60 * 1000 * 1000;
  const jaegerUrl = `http://localhost:8080/jaeger/ui/api/metrics/calls?service=${service}&lookback=3600000&quantile=0.95&ratePer=6000000&step=600000`;
  try {
    const response = await axios.get(jaegerUrl);
    console.log("getRequestsLastHourBarChart",response.data.metrics[0].metricPoints);
    const metrics = response.data.metrics[0].metricPoints;
    const array = [];
    metrics.forEach((metric) => {
      array.push(metric.gaugeValue.doubleValue);
    });
    if (response.status === 200) {
      const data = response.data;
      return array;
    } else {
      console.error(`Failed to retrieve data from Jaeger. Status code: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Error retrieving data from Jaeger: ${error}`);
    return null;
  } 
}

export async function getRequestsLastHourLineChart(serviceName){
  console.log("getRequestsLastHourLineChart====",serviceName);
  const jaegerUrl = `http://localhost:8080/jaeger/ui/api/metrics/calls?service=${serviceName}&lookback=3600000&quantile=0.95&ratePer=600000&step=60000`;
  try {
    const response = await axios.get(jaegerUrl);
    console.log("getRequestsLastHourLineChart",response.data.metrics[0].metricPoints);
    const metrics = response.data.metrics[0].metricPoints;
    const array = [];
    metrics.forEach((metric) => {
      
      array.push({
        date: new Date(metric.timestamp),
        value: metric.gaugeValue.doubleValue
      });
    });
    if (response.status === 200) {
      const data = response.data;
      return array;
    } else {
      console.error(`Failed to retrieve data from Jaeger. Status code: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Error retrieving data from Jaeger: ${error}`);
    return null;
  }
}

// getRequestsLastHourBarChart("cartservice").then((data) => {
//   console.log("getRequestsLastHourBarChart------------",data);
// });
// getTraces("frontend", "2021-07-01T00:00:00.000Z", "2021-07-02T00:00:00.000Z");

export async function getLatenciesLastHourBarChart(service){
  const currentTimeInMicroseconds = Date.now() * 1000;
  const oneHourAgoInMicroseconds = currentTimeInMicroseconds - 24* 60 * 60 * 1000 * 1000;
  const jaegerUrl = `http://localhost:8080/jaeger/ui/api/metrics/latencies?service=${service}&lookback=3600000&quantile=0.95&ratePer=6000000&step=600000`;
  try {
    const response = await axios.get(jaegerUrl);
    console.log("getLatenciesLastHourBarChart",response.data.metrics[0].metricPoints);
    const metrics = response.data.metrics[0].metricPoints;
    const array = [];
    metrics.forEach((metric) => {
      array.push(metric.gaugeValue.doubleValue);
    });
    if (response.status === 200) {
      const data = response.data;
      return array;
    } else {
      console.error(`Failed to retrieve data from Jaeger. Status code: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Error retrieving data from Jaeger: ${error}`);
    return null;
  } 
}

export async function getLatenciesLastHourLineChart(serviceName){
  
  const jaegerUrl = `http://localhost:8080/jaeger/ui/api/metrics/latencies?service=${serviceName}&lookback=3600000&quantile=0.95&ratePer=600000&step=60000`;
  try {
    const response = await axios.get(jaegerUrl);
    const metrics = response.data.metrics[0].metricPoints;
    const array = [];
    metrics.forEach((metric) => {
      
      array.push({
        date: new Date(metric.timestamp),
        value: metric.gaugeValue.doubleValue
      });
    });
    if (response.status === 200) {
      const data = response.data;
      return array;
    } else {
      console.error(`Failed to retrieve data from Jaeger. Status code: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Error retrieving data from Jaeger: ${error}`);
    return null;
  }
}
export async function getTraces20(serviceName){

    const jaegerUrl = `http://localhost:8080/jaeger/ui/api/traces?limit=20&lookback=1h&service=${serviceName}`;
    try {
      const response = await axios.get(jaegerUrl);
      console.log("Traces!!",response.data);
      if (response.status === 200) {
        const data = response.data;
        return data;
      }
    } catch (error) {
      console.error(`Error retrieving data from Jaeger: ${error}`);
      return [];
    }
}

