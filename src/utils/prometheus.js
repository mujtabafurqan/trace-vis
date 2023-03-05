import axios from 'axios';

async function getTraces(service){
  const traces = await axios.get('http://localhost:16686/jaeger/api/traces?service='+service + '.default&limit=20')
  console.log("traces" + service,traces);
}

export async function getPrometheusData(query) {
  const prometheusUrl = 'http://localhost:9090/api/v1/query';
  const params = new URLSearchParams({
    query: query,
    // time: 'now',
  });

  try {
    const response = await axios.get(prometheusUrl, {
      params: params,
    });
    if (response.status === 200) {
      const data = response.data;
      const results = data.data.result;
      console.log(results);
      const services = results.map((result) => ({
        name: result.metric.app,
        count: result.value[1],
      }));

      // services.forEach(element => {
      //   getTraces(element.name);
      // });
      
      return services;
    } else {
      console.error(`Failed to retrieve data from Prometheus. Status code: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Error retrieving data from Prometheus: ${error}`);
    return null;
  }

  
}

export async function getRequests(query) {
  const prometheusUrl = 'http://localhost:9090/api/v1/query';
  const params = new URLSearchParams({
    query: query,
    // time: 'now',
  });

  try{
    const response = await axios.get(prometheusUrl, {
      params: params,
    });
    if (response.status === 200) {
      const data = response.data;
      const results = data.data.result[0].values;
      // console.log("Requests",results);

      const start = parseInt(results[0][1]);
      const barchartData = [];
      for (let i = 1; i < results.length; i++) {
        const element = parseInt(results[i][1]) - start;
        barchartData.push(element);
      }
      // console.log("barchartData",barchartData);
      return barchartData;
    }
  }
  catch(error){
    console.error(`Error retrieving data from Prometheus: ${error}`);
    return null;
  }

}

