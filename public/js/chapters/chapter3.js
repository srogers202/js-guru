
initTest('Chapter 3 - Functions/Scopes and Context');

// --------------------------------------------------
// Function Literals and Names
// --------------------------------------------------

// perform tests
test('Function Literals and Names', function() {

    function function1() { }
    assert(function1.name === 'function1', 'function name is set with function literal definition');

    var function2 = function function3() {}
    assert(function2.name === 'function3', 'function name is set to the function literal, not the variable name');

    var function4 = function() {}
    assert(function4.name === '', 'function name is empty when anonymous, but set as a variable');

});


// --------------------------------------------------
// Scope/Context
// --------------------------------------------------

// perfom tests
test('Scope/Context', function() {

    (function() {

        assert(typeof scopeFunction === 'function', 'function literal set inside function block is accessbile before function is defined');
        assert(typeof scopeFunctionAsVar === 'undefined', 'variable function inside function block is NOT accessbile before defined');
        
        var scopeVar = 'setInScope';
        this.setInContext = 'setInContext'; //parent scope == context
        function scopeFunction() {};
        var scopeFunctionAsVar = function() {};
    })();

    assert(typeof scopeVar === 'undefined', 'var inside function block is not accessible in outter scope');
    assert(typeof setInContext === 'string', 'var assigned to \'this\' inside function block is accessible in outter scope');
    assert(typeof scopeFunction === 'undefined', 'function literal set inside function block is NOT accessbile in the function invocation scope');
});

// --------------------------------------------------
// 4 ways to call methods
// --------------------------------------------------
// perform tests
test("4 ways to call a method", function() {

    // 1) as a function
    function functionAsAFunction1() { return this; }
    assert(functionAsAFunction1() === this, 'Function as a function. Function literal uses current context');
    
    var functionAsAFunction2 = function() { return this; };
    assert(functionAsAFunction2() === this, 'Function as a function. Function as a variable uses current context');

    // 2) as a method
    var functionAsAMethod1 = {};
    functionAsAMethod1.func = function() { return this };
    assert(functionAsAMethod1.func() === functionAsAMethod1, 'Function as a method. Function as a methods uses the parent onject as context');
    
    var functionAsMethod2 = {
        func: function() { return this }
    }
    assert(functionAsAMethod1.func() === functionAsAMethod1, 'Function as a method. Function as a methods uses the parent onject as context');

    // 3) as a constructor
    function FunctionAsConstructor() {
        this.func = function() {
            return this;
        }
    }

    var functionAsConstructor1 = new FunctionAsConstructor();
    var functionAsConstructor2 = new FunctionAsConstructor();

    assert(functionAsConstructor1.func() === functionAsConstructor1, 'Function as a constructor. Function uses new object instance as context');
    assert(functionAsConstructor2.func() === functionAsConstructor2, 'Function as a constructor. Function uses new object instance as context');
    
    // 4) using apply/call
    function functionWithApplyAndCall(param1, param2) {
        this.p1 = param1;
        this.p2 = param2;
    }

    var contextWithApply = {};
    var contextWithCall = {};

    functionWithApplyAndCall.apply(contextWithApply, ['apply1', 'apply2']);
    functionWithApplyAndCall.call(contextWithCall, 'call1', 'call2');

    assert(contextWithApply.p1 === 'apply1' && contextWithApply.p2 === 'apply2', 'Function called with \'apply\' uses the context passed in as the first param');
    assert(contextWithCall.p1 === 'call1' && contextWithCall.p2 === 'call2', 'Function called with \'call\' uses the context passed in as the first param');
});