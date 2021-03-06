function PathFinder(_terrain) {

	const CONNECTED_NODES = [
		{x: -1, y: -1, cost: Math.sqrt(2)},
		{x: 0, y: -1, cost: 1},
		{x: 1, y: -1, cost: Math.sqrt(2)},
		{x: -1, y: 0, cost: 1},
		{x: 1, y: 0, cost: 1},
		{x: -1, y: 1, cost: Math.sqrt(2)},
		{x: 0, y: 1, cost: 1},
		{x: 1, y: 1, cost: Math.sqrt(2)},
	]

	const _steps = Matrix.create(_terrain.width(), _terrain.height(), () => 0)
	const _closedList = Matrix.create(
		_terrain.width(),
		_terrain.height(),
		() => ({cost: 0, closed: false})
	)
	const _openListMap = Matrix.create(_terrain.width(), _terrain.height(), () => undefined)

	const nodeEqual = node1 => node2 =>
		node1.x === node2.x && node1.y === node2.y

	function initClosedList() {
		_closedList.forEach(line => {
			line.forEach(node => {
				node.cost = 0
				node.closed = false
			})
		})
	}

	function initOpenListMap() {
		_openListMap.forEach(line => {
			for (let i = 0; i < line.length; i++) {
				line[i] = undefined
			}
		})
	}

  function findPath(start, rawEnd) {
		const sortByDistance = (node1, node2) =>
			(node1.cost+node1.heuristic) - (node2.cost+node2.heuristic)
		const end = {
			x: rawEnd.x,
			y: rawEnd.y,
			cost: 0,
			heuristic: 0
		}

		initClosedList()
		initOpenListMap()
		const openList = new Heap(sortByDistance)
		openList.push({x: start.x, y: start.y, cost: 0, heuristic: 0})
		while (openList.length() > 0) {
			const node = openList.pop()

			if (nodeEqual(node)(end)) return buildPath(start, end)

			for (let index = 0; index < CONNECTED_NODES.length; index++) {
				const connectedNode = CONNECTED_NODES[index]
				const nextNode = {
					x: node.x+connectedNode.x,
					y: node.y+connectedNode.y,
					cost: node.cost+connectedNode.cost,
					heuristic: 0
				}

				if (_terrain.isWall(nextNode.x, nextNode.y)) continue

				const finder = nodeEqual(nextNode)
				{
					const closedNode = _closedList[nextNode.x][nextNode.y]
					if (closedNode.closed && closedNode.cost <= nextNode.cost)
						continue
				}
				{
					const openedNode = _openListMap[nextNode.x][nextNode.y]
					if (openedNode && openedNode.cost <= nextNode.cost)
						continue
				}
				nextNode.heuristic = nextNode.cost + distance(nextNode.x, nextNode.y, end)
				openList.push(nextNode)
				_openListMap[nextNode.x][nextNode.y] = nextNode
				_steps[nextNode.x][nextNode.y] = connectedNode
			}

			_closedList[node.x][node.y].closed = true
			_closedList[node.x][node.y].cost = node.cost
		}
		return []
  }

	function buildPath(start, end) {
		let currentNode = Vector2D(end.x, end.y)
		const path = [currentNode]
		const startVector = Vector2D(start.x, start.y)
		while (!startVector.equals(currentNode)) {
			const step = _steps[currentNode.x()][currentNode.y()]
			currentNode = currentNode.add(Vector2D(-step.x, -step.y))
			path.unshift(currentNode)
		}
		return path
	}

	function distance(x, y, end) {
		return Vector2D(x, y).substract(Vector2D(x, y)).distance()
	}

	return {findPath}
}
