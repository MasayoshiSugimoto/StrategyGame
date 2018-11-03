const VECTOR_2D_EPSILON = 0.0001;

function Vector2D(_x, _y) {

	function x() { return _x }
	function y() { return _y }

	function add(v) {
		return Vector2D(v.x() + _x, v.y() + _y)
	}

	function substract(v) {
		return Vector2D(_x - v.x(), _y - v.y())
	}

	function scalarMultiply(scalar) {
		return Vector2D(_x * scalar, _y * scalar)
	}

	function resize(size) {
		return scalarMultiply(size / distance())
	}

	function normalize() { return resize(1.0) }

	function distance() {
		return Math.sqrt((_x * _x) + (_y * _y))
	}

	function squareDistance() { return (_x * _x) + (_y * _y) }

	function cut(size) {
		const length2 = (_x * _x) + (_y * _y)
		if (length2 > size*size && length2 > VECTOR_2D_EPSILON) {
			return resize(size)
		}
		return _instance
	}

	function rotate(angle) {
		return Vector2D(
			_x * Math.cos(angle) - _y * Math.sin(angle),
			_x * Math.sin(angle) + _y * Math.cos(angle)
		)
	}

	function dot(v) { return _x * v.x() + _y * v.y() }

	function toString() {
		return "{x:" + _x + ", y:" + _y + "}"
	}

	function minus() { return scalarMultiply(-1.0) }

	function equals(v) {
		let dx = _x - v.x()
		let dy = _y - v.y()
		return -VECTOR_2D_EPSILON < dx && dx < VECTOR_2D_EPSILON
				&& -VECTOR_2D_EPSILON < dy && dy < VECTOR_2D_EPSILON
	}

	function distanceTo(v) {
		return Vector2D.distanceBetween(_instance, v)
	}

	function isZero() {
		return (_x * _x + _y * _y) < VECTOR_2D_EPSILON
	}

	function min(v) {
		return Vector2D(
			Math.min(v.x(), _x),
			Math.min(v.y(), _y)
		)
	}

	function max(v) {
		return Vector2D(
			Math.max(v.x(), _x),
			Math.max(v.y(), _y)
		)
	}

	const _instance = {
		x,
		y,
		add,
		substract,
		scalarMultiply,
		resize,
		normalize,
		distance,
		squareDistance,
		cut,
		rotate,
		dot,
		toString,
		minus,
		equals,
		distanceTo,
		isZero,
		min,
		max
	}

	return _instance
}

Vector2D.ZERO = Vector2D(0.0, 0.0)
Vector2D.UNIT_X = Vector2D(1.0, 0.0)
Vector2D.UNIT_Y = Vector2D(0.0, 1.0)
Vector2D.distanceBetween = (v1, v2) => v1.substract(v2).distance()
