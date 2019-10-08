const Koa = require("koa");
const app = new Koa();

app.use(require("koa-static")("public"));
app.use(require("koa-bodyparser")());

const Router = require("koa-router");
const router = new Router();

const subscribers = [];

router.get("/subscribe", async (ctx, next) => {
  const p = new Promise((resolve, reject) => {
    subscribers.push(resolve);
  });
  ctx.body = await p;
});

router.post("/publish", async (ctx, next) => {
  const message = ctx.request.body.message;
  if (message !== undefined && message !== "") {
    subscribers.forEach(subscriber => {
      subscriber(message);
    });
  }

  ctx.status = 200;
  ctx.res.end();
});

app.use(router.routes());

module.exports = app;
