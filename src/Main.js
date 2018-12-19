function main() {
	console.log("Starting game...")

	const initializer = Initializer()

	for (let i = 0; i < 10; i++) {
		initializer.createActor()
	}

	let lastTimeStamp = 0
	const updater = timeStampMillisecond => {
		const deltaTimeMillisecond = timeStampMillisecond - lastTimeStamp
		lastTimeStamp = timeStampMillisecond

		initializer.screen.reset()
		initializer.terrainRenderer.render()
		initializer.collisionRenderer.render()
		initializer.particleSystem.update(deltaTimeMillisecond)
		initializer.actorSystem.update(deltaTimeMillisecond, initializer.screen.canvas())
		initializer.frameMonitor.onFrameDone(deltaTimeMillisecond)
		window.requestAnimationFrame(updater)
	}
	window.requestAnimationFrame(updater)
}
