function createPartialFunction(originalFunction, ...fixedArgs) {
    return function (...args) {
        return originalFunction.apply(null, fixedArgs.concat(args));
    };
}

function myFunction(a, b, c) {
    return a + b + c;
}

// Create a partial function with fixed arguments
const partialFunction = createPartialFunction(myFunction, 1, 2, 3);

// Now you can pass 'partialFunction' without executing it
const result = partialFunction(); // This is equivalent to calling myFunction(1, 2, 3)
console.log(result); // Output: 6