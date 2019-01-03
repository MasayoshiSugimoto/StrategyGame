function SortedQueue(comparator) {
	this._queue = []
	this._comparator = comparator
}

SortedQueue.prototype.add = function(element) {
	let index = Math.floor(element.length / 2)
	while () {
		if (comparator(element, this._queue[index]) == 0) {
		}
	}
}
