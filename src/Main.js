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

		//Game update
		initializer.particleSystem.update(deltaTimeMillisecond)
		initializer.actorSystem.update()

		//Rendering
		initializer.screen.reset()
		initializer.terrainRenderer.render()
		initializer.collisionRenderer.render()
		renderCircleComponents(initializer.actorSystem.getActors(), initializer.screen.canvas())
		initializer.frameMonitor.onFrameDone(deltaTimeMillisecond)

		window.requestAnimationFrame(updater)
	}
	window.requestAnimationFrame(updater)
}
