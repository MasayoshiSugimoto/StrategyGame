function Rectangle(x, y, width, height) {
	return new Rect(x, y, width, height)
}

function Rect(x, y, width, height) {
	this.x = x
	this.y = y
	this.width = width
	this.height = height
}

Rect.prototype.isInsideExclusive = function(x, y) {
	return this.x < x && x < this.x + this.width 
			&& this.y < y && y < this.y + this.height
}
