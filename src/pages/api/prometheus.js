const Prometheus = require('prom-client');

const registry = new Prometheus.Registry();
Prometheus.collectDefaultMetrics({ register: registry });

const client = new Prometheus.Pushgateway('http://localhost:9090');

export default async function handler(req, res) {
  const query = req.query.query;
  const result = await registry.getSingleMetric(query);
  const values = result.values.map(([timestamp, value]) => ({ x: timestamp * 1000, y: value }));
  console.log("values", values);

  res.status(200).json(values);
}
