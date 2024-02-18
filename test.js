class Test{
    constructor(){
        this.id = 12
    }
    tester(){
        console.log('tester')
    }
}

class Test2{
    constructor(){
        this.here = 'h'
    }

}

function t(){
    console.log('t')
}

const test = new Test()
const test2 = new Test2()
console.log(test.this)
console.log(t.this)
t.call(test)
console.log(t.id)
