import fastify from "fastify";

const server = fastify();

server.get("/", async (request, reply) => {
  return { hello: "world" };
});

server.listen({
    port: 3333,
    host: '0.0.0.0',
}).then(() => {
    console.log('👻 Server started');
});