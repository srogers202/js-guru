'use strict';

initTest('Chapter 4 - Advanced Functions');

// --------------------------------------------------
// Recursive functions
// --------------------------------------------------
test('Recursive functions', function() {

    function strMatchRec(str1, str2) {
        // type validation
        if (typeof str1 !== 'string' || typeof str2 !== 'string') return false;

        // true if both lengths are 0
        if (str1.length === 0 && str2.length === 0) return true;
        
        return (str1.charAt(0) === str2.charAt(0)) ? 
               (strMatchRec(str1.substr(1), str2.substr(1))) : 
               false;
    }

    assert(strMatchRec('one', 'one'), 'Recusion Works!');
    assert(!strMatchRec('fifty', 'seven'), 'Recusion REALLY Works!');
    assert(!strMatchRec([], {}), 'Recursive function validation works');
});

// --------------------------------------------------
// Recursive methods
// --------------------------------------------------
test('Recursive methods with named references to anonymous functions', function() {
    'use strict;';
    var swimmer = {
        race: function(energyLevel, distance) { // anonymous functions
            // Set distance if not a number
            distance = (typeof distance !== 'number') ? 0 : distance;

            return (energyLevel < 1) ? 
                    `${distance}m` :  // return total distance when energy is gone
                    swimmer.race(energyLevel - 1, distance + 10); // reduce energy and increment distance
        }                                                      // using 'this.' allows the method to be anonymous
    };

    // Reuse method in another object
    var triathalete = {
        race: swimmer.race
    };

    // Throw away the swimmer object
    swimmer = {};

    assertException(function() {
        triathalete.race(10);
    }, 'Recursive methods don\'t work with anonymous functions and references to the parent object');
});

// --------------------------------------------------
// Recursive methods
// --------------------------------------------------
test('Recursive methods with named references to anonymous functions using \'this\'', function() {
    'use strict;';
    var swimmer = {
        race: function(energyLevel, distance) { // anonymous functions
            // Set distance if not a number
            distance = (typeof distance !== 'number') ? 0 : distance;

            return (energyLevel < 1) ? 
                    `${distance}m` :  // return total distance when energy is gone
                    this.race(energyLevel - 1, distance + 10); // reduce energy and increment distance
        }                                                      // using 'this.' allows the method to be anonymous
    };

    // Reuse method in another object
    var triathalete = {
        swim: swimmer.race
    };

    // Throw away the swimmer object
    swimmer = {};

    assertException(function() {
        triathalete.swim(10);
    }, 'Recursive methods don\'t work with anonymous functions when the reference name changes');
});

// --------------------------------------------------
// Recursive methods
// --------------------------------------------------
test('Recursive methods work! We used a named function literal. The function name persists!', function() {
    
    var swimmer = {
        race: function perform(energyLevel, distance) { // anonymous functions
            // Set distance if not a number
            distance = (typeof distance !== 'number') ? 0 : distance;

            return (energyLevel < 1) ? 
                    `${distance}m` :  // return total distance when energy is gone
                    perform(energyLevel - 1, distance + 10); // reduce energy and increment distance
        }                                                      // using 'this.' allows the method to be anonymous
    };

    // Reuse method in another object
    var triathalete = {
        swim: swimmer.race
    };

    // Throw away the swimmer object
    swimmer = {};

    assert(triathalete.swim(10) === '100m', 'Recursive method works with named function literal');

});

// --------------------------------------------------
// Function properties
// --------------------------------------------------
test('Adding properties to functions', function() {
    "use strict";
    // process runner. Add functions to run on loop
    var runner = {
        // keep track of the next id
        nextId: 1,

        // store functions
        cache: {},

        //status
        status: 'pause',

        // add a function to the cache (disallow dupes)
        add: function(fn) {
            // Check the function's cache id. This is where the property
            // setting makes the function efficient. We also set the
            // execution count to 0. This another use of the function properties
            if (!fn.cacheId) {
                fn.cacheId = this.nextId++;
                fn.executionCount = 0;
                return !!(this.cache[fn.cacheId] = fn);
            }
        },

        // remove a function from the cache
        remove: function(fn) {
            if (fn.cacheId && this.cache[fn.cacheId]) {
                this.cache[fn.cacheId] = function() {};
                fn.cacheId = false;
            }
        },

        // begin
        start: function() {
            if (this.status !== 'start') {
                this.startLoop();
                this.status = 'start';
            }
        },

        // pause the loop
        pause: function() {
            this.status = 'pause';
        },

        // run loop recursively
        startLoop: function() {
            this.loopOnce();
            var _this = this;
            setTimeout(function() { // ES6 loop possible here! Inherits parent scope(s)
                if (_this.status === 'start') {
                    // continue loop
                    _this.startLoop();
                }
            }, 1000);
        },

        // run each function once
        loopOnce: function() {
            
            for(var i=1;i<this.nextId;i++) {
                if (typeof this.cache[i] === 'function') {
                    this.cache[i]();
                    var name = 'this';
                    // incrememnt execution count -- using property of function
                    this.cache[i].executionCount++;
                }
            }
        }
    }

    // named literal
    function func1() {
        //console.log('func1');
    }

    // anonymous function
    var func2 = function() {
        //console.log('func2');
    }

    assert(runner.add(func1), 'Adding a new function succeeds');
    assert(!runner.add(func1), 'Adding an existing doesn\'t succeed. The function property worked');
    
    runner.add(func2);
    
    runner.loopOnce();

    assert(func1.executionCount === 1, 'The executionCount property was set correctly for named literal function');
    assert(func2.executionCount === 1, 'The executionCount property was set correctly for anonymous literal function');

    runner.start();

    setTimeout(function() {
        runner.pause();
        console.log(func1.executionCount);
    }, 10000);

});

// --------------------------------------------------
// Function memoization
// --------------------------------------------------
test('Self Memoization', function() {

    function isPrime(value) {
        if (typeof isPrime.cache !== 'object') isPrime.cache = {};

        if (isPrime.cache[value] != null) {
            return { 'isPrime': isPrime.cache[value], 'iterations': 1};
        }
        var prime = value != 1; // 1 cannot be prime
        var iterations = 0;
        for (var i=2; i< value; i++) {

            iterations++;
            if (value % i == 0) {
                prime = false;
                break;
            }
            if ((value / i) < 2) {
                break;
            }
        }
        return {'isPrime': isPrime.cache[value] = prime, 'iterations': iterations};
    }

    assert(isPrime(23).isPrime, 'isPrime works for primes!');
    assert(!isPrime(50).isPrime, 'isPrime works for non primes!')
    assert(isPrime(3571).isPrime, 'big prime works too');
    assert(isPrime(3491).iterations > 100, 'big primes take a lot of iterations');
    assert(isPrime(3491).iterations * isPrime(3571).iterations * isPrime(50).iterations * isPrime(23).iterations === 1, 'but only once!');
});

// --------------------------------------------------
// Extending arrays
// --------------------------------------------------
test('Extending arrays', function() {

    // an array to store ONLY the types of objects passed in (pretty useless, i know)
    var typeArray = {

        // the Array.prototype.push will update this
        length: 0,

        // create an add method to add the type
        add: function(obj) {
            // Reuse the Array.prototype.call method
            Array.prototype.push.call(this, typeof obj);
        }
    }

    typeArray.add('this is a string');
    assert(typeArray[0] === 'string', 'Extended array works!');

    typeArray.add({'an': 'object'});
    assert(typeArray[1] === 'object', 'Extended array works!');
    assert(typeArray.length == 2, 'Extended array length works too')

});

