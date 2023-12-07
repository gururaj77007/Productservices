// redisConnection.js
const redis = require("redis");

const client = redis.createClient({
  password: "EHY9RvDJuUuy2bKmLQWNYHE9lzAq7Ddt",
  socket: {
    host: "redis-14069.c305.ap-south-1-1.ec2.cloud.redislabs.com",
    port: 14069,
  },
});
client.connect();
client.on("connect", (error) => console.log("connection"));

client.on("error", (error) => console.error(`Error: ${error}`));

module.exports = client;
