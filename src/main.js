function main() {
	console.log("Starting game...")

	const initializer = Initializer()

	const createActor = (targetId) => {
		let actor = initializer.actorSystem.createActor()

		const x = Math.random() * initializer.terrain.width()
		const y = Math.random() * initializer.terrain.height()
		initializer.particleSystem.createParticle(Vector2D(x, y), actor.id())

		actor.addRenderComponent(CircleRendererComponent(
			actor,
			10,
			"white",
			initializer.worldProjection
		))

		const healthComponent = HealthComponent(100, 100)
		actor.setHealthComponent(healthComponent)
		actor.addRenderComponent(HPBarRendererComponent(
			actor,
			healthComponent,
			initializer.worldProjection
		))

	}

	const actorMax = 1
	for (let i = 0; i < actorMax; i++) {
		createActor((i+1)%actorMax)
	}

	let lastTimeStamp = 0
	const updater = timeStampMillisecond => {
		const deltaTimeMillisecond = timeStampMillisecond - lastTimeStamp
		lastTimeStamp = timeStampMillisecond
		initializer.screen
				.fullScreen()
				.setBackgroundColor("black")
		initializer.terrainRenderer.render(initializer.screen.canvas())
		initializer.collisionRenderer.render()
//		Terrain.renderCollisionData(
//				initializer.screen.canvas(),
//				initializer.worldProjection,
//				Terrain.optimizeCollisionData(Terrain.string2Data(`
//000000000000000
//010001111100010
//011000111100110
//011100001101110
//011000011100110
//010001111111111
//000000000011111
//`)))
		const deltaTimeSecond = deltaTimeMillisecond / 1000.0
		initializer.particleSystem.update(deltaTimeMillisecond)
		initializer.actorSystem.update(deltaTimeMillisecond, initializer.screen.canvas())
		initializer.frameMonitor.onFrameDone(deltaTimeMillisecond)
		window.requestAnimationFrame(updater)
	}
	window.requestAnimationFrame(updater)
}
