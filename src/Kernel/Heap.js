function Heap(comparator) {
	this.tree = []
	this.comparator = comparator
}

Heap.prototype.push = function(element) {
	this.tree.push(element)
	let index = this.tree.length - 1
	while (true) {
		const parentIndex = Heap.parent(index)
		if (parentIndex < 0) break
		const diff = this.comparator(this.tree[parentIndex], this.tree[index])
		if (diff <= 0) {
			break
		} else {
			const tmpNode = this.tree[parentIndex]
			this.tree[parentIndex] = this.tree[index]
			this.tree[index] = tmpNode
		}
		index = Heap.parent(index)
	}
}

Heap.prototype.pop = function() {
	if (this.tree.length === 0) return undefined
	const root = this.tree[0]
	this.tree[0] = this.tree[this.tree.length-1]
	let index = 0
	while (index < this.tree.length) {
		const leftIndex = Heap.left(index)
		const rightIndex = leftIndex + 1
		let childIndex = leftIndex
		if (leftIndex >= this.tree.length) break
		if (rightIndex >= this.tree.length) {
			childIndex = leftIndex
		} else {
			childIndex = (this.comparator(this.tree[leftIndex], this.tree[rightIndex]) <= 0)
					? leftIndex
					: rightIndex
		}
		if (this.comparator(this.tree[childIndex], this.tree[index]) >= 0) {
			break
		}
		const tmpNode = this.tree[index]
		this.tree[index] = this.tree[childIndex]
		this.tree[childIndex] = tmpNode
		index = childIndex
	}
	this.tree.pop()
	return root
}

Heap.prototype.length = function() {
	return this.tree.length
}

Heap.prototype.find = function(finder) {
	return this.tree.find(finder)
}

Heap.left = function(index) {
	return 2 * index + 1
}

Heap.right = function(index) {
	return 2 * index + 2
}

Heap.parent = function(index) {
	const correctedIndex = index + 1
	const leftIndex = (correctedIndex % 2 === 0)
		? correctedIndex
		: correctedIndex - 1
	return (leftIndex / 2) - 1
}

Heap.test = function() {
	console.log("Heap.test()")
	const heap = new Heap((x, y) => x - y)
	const ITERATION_COUNT = 1000000
	const NUMBER_MAX = 1000
	const numberOccurences = ArrayUtil.init(() => 0, NUMBER_MAX)
	for (let i = 0; i < ITERATION_COUNT; i++) {
		const number = Math.floor(Math.random() * NUMBER_MAX)
		heap.push(number)
		numberOccurences[number]++
	}

	const result = []
	for (let i = 0; i < ITERATION_COUNT; i++) {
		result.push(heap.pop())
	}

	//Check that the heap is cleaned up
	assert(heap.tree.length === 0)

	//Check that the pop returns the values in sorted order
	result.reduce((previous, current) => {
		assert(previous <= current)
		return current
	}, 0)

	//Check that the return values are the same
	for (let i = 0; i < result.length; i++) {
		numberOccurences[result[i]]--
	}
	numberOccurences.forEach(number => assert(number === 0))

	console.log("Heap.test() SUCCESS")
}
