function WorldProjection() {

	function toScreenCoordinates(vector) {
		return vector.scalarMultiply(WorldProjection.PIXELS_PER_METER)
	}

	function meterToPixel(distanceMeter) { return distanceMeter * WorldProjection.PIXELS_PER_METER }
	function pixelToMeter(pixel) { return pixel / WorldProjection.PIXELS_PER_METER }

	function projectRectangleToScreen(rectangle) {
		return Rectangle(
			meterToPixel(rectangle.x),
			meterToPixel(rectangle.y),
			meterToPixel(rectangle.width),
			meterToPixel(rectangle.height))
	}

	return {toScreenCoordinates, meterToPixel, pixelToMeter, projectRectangleToScreen}
}

WorldProjection.PIXELS_PER_METER = 20

