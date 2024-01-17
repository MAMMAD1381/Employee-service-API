class Test{
    constructor(){
        this.id = 12
    }
    tester(){
        console.log('tester')
    }
}

const test = new Test()
const stringified = JSON.stringify(test)
const parsed = JSON.parse(stringified)
console.log(test.tester(), parsed)

methods: add, begin, rollback
add: you can add requests and rollbacks of your desired service
beging: this function begins the operations simultanouslly and if a
problem occures during the requests or on results of operations the
rollback will be initiated
rollback: it will perform rollback for all services