function drawSegment(canvas, begin, end) {
	canvas.beginPath()
	canvas.moveTo(begin.x(), begin.y())
	canvas.lineTo(end.x(), end.y())
	canvas.stroke()
}

function drawVector(canvas, begin, end) {
	const mainVector = begin.substract(end)
	if (mainVector.isZero()) return
	const baseVector = mainVector.cut(mainVector.distance() / 3.0)
	const angle = Math.PI / 6.0

	canvas.beginPath()
	canvas.moveTo(begin.x(), begin.y())

	canvas.lineTo(end.x(), end.y())
	{
		const arrowVector = end.add(baseVector.rotate(angle))
		canvas.lineTo(arrowVector.x(), arrowVector.y())
	}

	canvas.lineTo(end.x(), end.y())
	{
		const arrowVector = end.add(baseVector.rotate(-angle))
		canvas.lineTo(arrowVector.x(), arrowVector.y())
	}

	canvas.stroke()
}
	
