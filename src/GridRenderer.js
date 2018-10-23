function GridRenderer(actors) {

	const width = 100
	const height = 100

	const _grid = []
	for (x = 0; x < width; x++) {
		_grid[x] = []
		for (y = 0; y < height; y++) {
			_grid[x][y] = false
		}
	}

	actors.forEach(actor => {
		_grid[actor.x()][actor.y()] = true;
	})

	const screen = document.getElementById("screen")
	
	{
		const grid = document.getElementById("grid")
		if (grid !== null) screen.removeChild()
	}

	const table = document.createElement("table")
	table.style.border = "1px black solid"
	table.id = "grid"
	_grid.forEach(column => {
		const tr = document.createElement("tr")
		column.forEach(cell => {
			const th = document.createElement("td")
			if (cell) th.style.backgroundColor = "black"
			tr.appendChild(th)
		})
		table.appendChild(tr)
	})
	screen.appendChild(table)
}
