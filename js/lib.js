/**
 * Partitions the elements into two groups: those for which the iterator returns
 * true, and those for which it returns false.
 * @param {Function} iterator
 * @param {Object} [context] Optional context parameter to be
 * used as `this` when calling the iterator function.
 *
 * @type Array
 * @returns An array in the form of [trueCollection, falseCollection]
 */
Array.prototype.partition = function(iterator, context) {
  var trueCollection = [];
  var falseCollection = [];
 
	for (var i = 0, len = this.length; i < len; i++) {
    if(iterator.call(context, this[i])) {
      trueCollection.push(this[i]);
    } else {
      falseCollection.push(this[i]);
    }
	} 
 
  return [trueCollection, falseCollection];
};

function randInt(max) {
  return Math.floor(rand(max));
};

function randRangeInt(min, max) {
  const r = rand(max);
  return Math.floor(r < min ? min : r);
}

function rand(max, incNegatives = false) {
  return (Math.random() * max) * (incNegatives ? (Math.random() * 2 > 1 ? -1 : 1) : 1);
};
