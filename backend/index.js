const express = require('express');
var bodyParser = require('body-parser');
var productRouter = require("./routers/product_router.js");
var productDB = require("./db/productDB.js");
var cors = require('cors');
var { createClient } = require('redis');
const maxRetries = 100; // Number of times to try for reconnecting
const retryDelay = 1000; // Milliseconds

const clientUrl = process.env.NODE_ENV === 'production' ?  process.env.REDIS_URL : process.env.REDIS_URL_DEV;
const client = createClient({
  url: clientUrl,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > maxRetries) {
        return undefined; // Connection terminates
      }
      console.log(`Retrying redis connection - ${retries}`);
      return retryDelay;
    },
    connectionTimeout: 300000, // 5 minutes
  },
});

let cacheConnected = false;
client.on('error', (err) =>{
  console.log("Redis error, can't connect to ", err.message );
  cacheConnected = false;
});

client.on('connect', () => {
  console.log("Connected to Redis");
  cacheConnected = true;
}
);

client.connect();

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 5000;

app.use("/api/products", productRouter);

app.get("/api/health", (req, res) => {
  res.json({server: true, database: productDB.status, cache: cacheConnected});
});

/* Start our server on port */
app.listen(port, () => {
  console.log(`Application started at http://localhost:${port}`);
});
