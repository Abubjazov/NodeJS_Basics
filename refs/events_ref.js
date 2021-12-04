const EventEmitter = require('events')

class Logger extends EventEmitter {

    log(msg) {
        this.emit('event', `${msg} ${Date.now()}`)
    }

}

const logger = new Logger()

logger.on('event', msg => {
    console.log(msg)
})

logger.log('Hello 0')
logger.log('Hello 1')
logger.log('Hello 2')
