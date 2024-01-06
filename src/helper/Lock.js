class Lock {
    constructor() {
        this.isLocked = false;
        this.queue = [];
    }

    async acquire() {
        return new Promise(resolve => {
            const tryAcquire = () => {
                if (!this.isLocked) {
                    this.isLocked = true;
                    resolve();
                } else {
                    // Queue for later
                    this.queue.push(tryAcquire);
                }
            };

            tryAcquire();
        });
    }

    release() {
        this.isLocked = false;

        // Execute next in the queue
        const next = this.queue.shift();
        if (next) {
            next();
        }
    }
}
module.exports = Lock