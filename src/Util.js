function assert(condition, message) {
	if (!condition) throw message
}

function clamp(min, value, max) {
	return Math.max(min, Math.min(value, max))
}
