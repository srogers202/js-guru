'use strict';

initTest('Chapter 4 - Advanced Functions');

// --------------------------------------------------
// Recursive functions
// --------------------------------------------------

// perform tests
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

//perform test
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

//perform test
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

//perform test
test('Recursive methods work! We used a named function literal. The function name persists!', function() {
    'use strict;';
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