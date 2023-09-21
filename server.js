const express = require("express");
const app = express();
app.use(express.json());
const redis = require("redis");
const host = "localhost";
const port = 6379;
const clientRedis = redis.createClient(port, host);

let databaseClients = [
    {
      name: "Isabella Campos",
    },
    {
      name: "Thiago Xavier",
    },
  ];


// simulating a request response time problem
const getAllClients = async () => {
  const timeToRespond = Math.random() * 8000;
  return new Promise((clients) => {
    setTimeout(() => {
        clients(databaseClients);
    }, timeToRespond);
  });
};

app.post("/", async (req, res) => {
    const key = "clients";
    databaseClients.push(req.body)

    await clientRedis.del(key);
    res.status(201).send("Created");
});

app.get("/", async (req, res) => {
  const key = "clients";
  try {
    const clientFrmCache = await clientRedis.get("clients");
    if (clientFrmCache) {
      res.status(200).send(JSON.parse(clientFrmCache));
      return;
    }

    const clients = await getAllClients();
    await clientRedis.set(key, JSON.stringify(clients), { EX: 20 });
    res.status(200).send(clients);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

const startupApplication = async () => {
  await clientRedis.connect();
  app.listen(3000, () => console.log("Server is running on port 3000"));
};

startupApplication();
