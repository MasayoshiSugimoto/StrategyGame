function StopWatch() {
	
	let _start = Date.now()

	function start() {
		_start = Date.now()
	}

	function lap() {
		const end = Date.now()
		const elapsedTimeMillisecond = end - _start
		_start = end
		return elapsedTimeMillisecond
	}

	return {start, lap}
}
