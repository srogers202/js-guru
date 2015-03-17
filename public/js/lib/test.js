/*
* My own custom test library (inspired by chapter 2 from the book "Secrets of the JavaScript Ninja")
*
* Each test creates a new scope and can accept multiple assertsions
* 
* // Example
* 
* initTest('Start Test Suite');
*
* test(function() {
*    
*   assert(true, 'First Assertion');
*   
*    function throwException() {
*      badVar = 1;
*    }
*
*    assertException(throwException, 'Second Assertion');      
*
* }, 'Test Description');
*
*/
function initTest(name) {
  var results = document.getElementById('results');
  var header = document.createElement('h3');

  header.appendChild(document.createTextNode(name));
  results.appendChild(header);
}

(function() {

  var results;
  this.assert = function(value, desc) {
    var li = document.createElement('li');
    li.className = value ? 'pass' : 'fail';
    li.appendChild(document.createTextNode(desc));
    results.appendChild(li);
    if (!value) {
      li.parentNode.parentNode.className = 'fail';
    }
    return li;
  };

  this.assertException = function(fn, desc) {
    var exThrown = false;
    try {
      fn();
    } catch(e) { 
      exThrown = true;
    }
    assert(exThrown, desc);
  };

  this.test = function(name, fn) {
    results = document.getElementById('results');
    results = assert(true, name).appendChild(
      document.createElement('ul'));
    fn();
  };
})();