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