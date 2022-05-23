const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const chatMessageEvent = 'chat-message';

router.get('/subscribe', async (ctx, next) => {
  await new Promise((resolve) => {
    const handleChatMessage = (message) => {
      ctx.status = 200;
      ctx.body = message;
      resolve();
    };
    ctx.app.on(chatMessageEvent, handleChatMessage);
    ctx.req.on('close', () => {
      ctx.app.off(chatMessageEvent, handleChatMessage);
    });
  });
});

router.post('/publish', async (ctx, next) => {
  if (ctx.request.body.message !== undefined) {
    ctx.app.emit(chatMessageEvent, ctx.request.body.message);
    ctx.status = 200;
  }
});

app.use(router.routes());

module.exports = app;
