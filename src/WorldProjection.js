function WorldProjection() {

	function toScreenCoordinates(vector) {
		return vector.scalarMultiply(WorldProjection.PIXELS_PER_METER)
	}

	function meterToPixel(distanceMeter) { return distanceMeter * WorldProjection.PIXELS_PER_METER }
	function pixelToMeter(pixel) { return pixel / WorldProjection.PIXELS_PER_METER }

	return {toScreenCoordinates, meterToPixel, pixelToMeter}
}

WorldProjection.PIXELS_PER_METER = 20

