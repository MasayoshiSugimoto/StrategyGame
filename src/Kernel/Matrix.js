function Matrix() {}

Matrix.create = function(width, height, value) {
	const m = []
	for (let x = 0; x < width; x++) {
		m[x] = []
		for (let y = 0; y < height; y++) {
			m[x][y] = value
		}
	}
	return m
}
