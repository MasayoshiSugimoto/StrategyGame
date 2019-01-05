function ArrayUtil() {}

ArrayUtil.init = function(factory, size) {
	const a = []
	for (let i = 0; i < size; i++) {
		a[i] = factory()
	}
	return a
}
