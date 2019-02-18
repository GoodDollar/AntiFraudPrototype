import fastify from "fastify";

const server = fastify({ logger: { prettyPrint: true } });

server.post("/enroll", async () => {
  return "hiya";
});

const port = parseInt(process.env.PORT || "3001");
server.listen(port);
