// Create a static 'extends' method on the Object class
// This allows us to extend existing classes
// for classical object-oriented inheritance
Object.extend = function(superClass, definition) {
    var subClass = function() {};
    // Our constructor becomes the 'subclass'
    if (definition.constructor !== Object)
        subClass = definition.constructor;
    subClass.prototype = new superClass();
    for (var prop in definition) {
    	if (prop != 'constructor')
            subClass.prototype[prop] = definition[prop];
    }
    // Keep track of the parent class
    // so we can call its constructor too
    subClass.superClass = superClass;
    return subClass;
};

Function.prototype.implement = function() {
    // Loop through each interface passed in and then check
    // that its members are implemented in the context object (this)
    for(var i = 0; i <arguments.length; i++) {
         var interf = arguments[i];
         // Is the interface a class type?
         if (interf.constructor === Object) {
             for (prop in interf) {
                 // Check methods and fields vs context object (this)
                 if (interf[prop].constructor === Function) {
                     if (!this.prototype[prop] ||
                          this.prototype[prop].constructor !== Function) {
                          throw new Error('Method [' + prop
                               + '] missing from class definition.');
                     }
                 } else {
                     if (this.prototype[prop] === undefined) {
                          throw new Error('Field [' + prop
                               + '] missing from class definition.');
                     }
                 }
             }
         }
    }
    // Remember to return the class being tested
    return this;
}