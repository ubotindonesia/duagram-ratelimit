# duaGram 
## Rate Limit

Rate-limiting middleware for [duaGram (Telegram user/bot framework)](https://github.com/ubotindonesia/duagram/).

Inspired [Telegraf rate limit](https://github.com/telegraf/telegraf-ratelimit).

### Install

    npm i duagram-ratelimit

### Example

```javascript
const { duaGram, terminal } = require("duagram");
const rateLimit = require('duagram-ratelimit')

const bot = new duaGram({
    api_id: 1,
    api_hash: 'your-api-hash',
    session: ''
});

const userLimitMessage = {
    window: 3 * 1000, // 3000 ms, or 3 seconds
    limit: 1, // 1 message
    onLog: terminal.debug, // false
    onLimitExceeded: (ctx, next) => {
        terminal.warn('Floooood!');
        bot.sendMessage(ctx, 'Hi! Do you want flooding me?');
    }
}

// all message type, no need action - just limit
bot.middleware(rateLimit(userLimitMessage));

bot.start();
```

### Options

- `window` how long to keep records of requests in memory in ms (default: 1 second)
- `limit` max number of messages during window (default: `1`)
- `keyGenerator` key generator function (context -> any)
- `onLog` log function to execute, default `console.log` (optional)
- `action` if not limit, run this function (optional)
- `onLimitExceeded` rate-limit middleware


### keyGenerator

Default is:

```javascript
function keyGenerator(ctx) {
    let peerId = ctx.fromId.userId ? ctx.fromId.userId : ctx.fromId.channelId;
    return peerId;
}
```

## More Example

### Limit Ping

```javascript
const { duaGram, terminal } = require("duagram");
const rateLimit = require('duagram-ratelimit')

const bot = new duaGram({ .. });

let pingExec = (ctx) => {
    bot.sendMessage(ctx, 'pong!');
}

let pingRules = {
    window: 5 * 1000, // 5 seconds
    limit: 2, // 2 message in 5 seconds
    onLog: false, // log dont show 
    keyGenerator: (ctx) => {
        let peerId = ctx.fromId.userId ? ctx.fromId.userId : ctx.fromId.channelId;
        return peerId+"_cmdPing";
    },
    action: pingExec,
    onLimitExceeded: (ctx, next) => {
        terminal.warn('Ping Flood!');
        bot.sendMessage(ctx, 'Hi! Do you want flooding me?');
    }
}

bot.cmd('ping', rateLimit(pingRules));

bot.start();
```
