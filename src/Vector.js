
function Vector(_x, _y) {

	function x() { return _x }
	function y() { return _y }

	function add(v) {
		return Vector(_x + v.x(), _y + v.y())
	}

	return {x, y, add}
}
