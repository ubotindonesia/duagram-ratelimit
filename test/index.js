const { duaGram, terminal } = require('duagram');
const rateLimit = require('duagram-ratelimit')

const bot = new duaGram({
    api_id: 1,
    api_hash: 'your-api-hash',
    session: ''
});

const userLimitMessage = {
    window: 10 * 1000, // 10 seconds
    limit: 3, // 3 message
    onLog: terminal.debug, // false
    onLimitExceeded: (ctx, next) => {
        terminal.warn('Floooood!');
        bot.sendMessage(ctx, 'Hi! Do you want flooding me?');
    }
}

// all message type
bot.middleware(rateLimit(userLimitMessage));


bot.start();