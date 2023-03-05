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