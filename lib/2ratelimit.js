/*
* Inspired : https://github.com/telegraf/telegraf-ratelimit
*/

class MemoryStore {
    constructor(clearPeriod) {
        this.hits = new Map()
        setInterval(this.reset.bind(this), clearPeriod)
    }

    incr(key) {
        var counter = this.hits.get(key) || 0
        counter++
        this.hits.set(key, counter)
        return counter
    }

    reset() {
        this.hits.clear()
    }
}


module.exports = function limit(options) {
    const config = Object.assign({
        window: 1000,
        limit: 1,
        keyGenerator: function (ctx) {
            let peerId = ctx.fromId.userId ? ctx.fromId.userId : ctx.fromId.channelId;
            return peerId;
        },
        onLog: console.log,
        action: () => { },
        onLimitExceeded: () => { }
    }, options)

    const store = new MemoryStore(config.window)
    return (ctx, next) => {
        const key = config.keyGenerator(ctx);
        if (!key) {
            return config.action(ctx);
        }
        const hit = store.incr(key);
        if (config.onLog) config.onLog('Key stats', key, hit);
        return hit <= config.limit ? config.action(ctx) : config.onLimitExceeded(ctx, next)
    }
}