const VECTOR_2D_EPSILON = 0.0001;

function Vector2D(x, y) {
	return new V2D(x, y)
}

function V2D(x, y) {
	this._x = x
	this._y = y
}

V2D.prototype.x = function() { return this._x }
V2D.prototype.y = function() { return this._y }

V2D.prototype.add = function(v) {
	return new V2D(v._x + this._x, v._y + this._y)
}

V2D.prototype.substract = function(v) {
	return new V2D(this._x - v._x, this._y - v._y)
}

V2D.prototype.scalarMultiply = function(scalar) {
	return new V2D(this._x * scalar, this._y * scalar)
}

V2D.prototype.resize = function(size) {
	return this.scalarMultiply(size / this.distance())
}

V2D.prototype.normalize = function() {
	return this.resize(1.0)
}

V2D.prototype.distance = function() {
	return Math.sqrt((this._x * this._x) + (this._y * this._y))
}

V2D.prototype.squareDistance = function() {
	return (this._x * this._x) + (this._y * this._y)
}

V2D.prototype.cut = function(size) {
	const length2 = this.squareDistance()
	if (length2 > size*size && length2 > VECTOR_2D_EPSILON) {
		return this.resize(size)
	}
	return this
}

V2D.prototype.rotate = function(angle) {
	const cosine = Math.cos(angle)
	const sine = Math.sin(angle)
	return new V2D(
		this._x * cosine - this._y * sine,
		this._x * sine + this._y * cosine
	)
}

V2D.prototype.dot = function(v) {
	return this._x * v._x + this._y * v._y
}

V2D.prototype.toString = function() {
	return `{x: ${this._x} ,y: ${this._y}}`
}

V2D.prototype.minus = function() {
	return this.scalarMultiply(-1.0)
}

V2D.prototype.equals = function(v) {
	const dx = this._x - v._x
	const dy = this._y - v._y
	return -VECTOR_2D_EPSILON < dx && dx < VECTOR_2D_EPSILON
			&& -VECTOR_2D_EPSILON < dy && dy < VECTOR_2D_EPSILON
}

V2D.prototype.distanceTo = function(v) {
	return Vector2D.distanceBetween(this, v)
}

V2D.prototype.isZero = function() {
	return (this._x * this._x + this._y * this._y) < VECTOR_2D_EPSILON
}

V2D.prototype.min = function(v) {
	return new V2D(
		Math.min(v._x, this._x),
		Math.min(v._y, this._y)
	)
}

V2D.prototype.max = function(v) {
	return new V2D(
		Math.max(v._x, this._x),
		Math.max(v._y, this._y)
	)
}

V2D.prototype.map = function(f) {
	return new V2D(f(this._x), f(this._y))
}

Vector2D.ZERO = Vector2D(0.0, 0.0)
Vector2D.UNIT_X = Vector2D(1.0, 0.0)
Vector2D.UNIT_Y = Vector2D(0.0, 1.0)
Vector2D.distanceBetween = (v1, v2) => v1.substract(v2).distance()
