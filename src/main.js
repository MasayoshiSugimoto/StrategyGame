function main() {
	console.log("Starting game...")

	const worldProjection = WorldProjection()
	const mouse = Mouse(worldProjection)
	const terrain = Terrain(worldProjection, TERRAIN_DATA)
	const particleSystem = ParticleSystem(
		Vector2D(terrain.width(), terrain.height()),
		1.5,
		mouse
	)
	const actorSystem = ActorSystem(terrain, particleSystem)

	const createActor = (targetId) => {
		let actor = actorSystem.createActor()

		const x = Math.random() * terrain.width()
		const y = Math.random() * terrain.height()
		particleSystem.createParticle(Vector2D(x, y), actor.id())

		actor.addRenderComponent(CircleRendererComponent(actor, 10, "white", worldProjection))

		const healthComponent = HealthComponent(100, 100)
		actor.setHealthComponent(healthComponent)
		actor.addRenderComponent(HPBarRendererComponent(actor, healthComponent, worldProjection))

	}
	const actorMax = 20
	for (let i = 0; i < actorMax; i++) {
		createActor((i+1)%actorMax)
	}

	const terrainRenderer = TerrainRenderer(terrain, worldProjection)

	const debugWindow = DebugWindow()
	const frameMonitor = FrameMonitor(debugWindow)

	const screen = Screen()
	let lastTimeStamp = 0
	const updater = timeStampMillisecond => {
		const deltaTimeMillisecond = timeStampMillisecond - lastTimeStamp
		lastTimeStamp = timeStampMillisecond
		screen
				.fullScreen()
				.setBackgroundColor("black")
		terrainRenderer.render(screen.canvas())
		const deltaTimeSecond = deltaTimeMillisecond / 1000.0
		particleSystem.update(deltaTimeMillisecond)
		actorSystem.update(deltaTimeMillisecond, screen.canvas())
		frameMonitor.onFrameDone(deltaTimeMillisecond)
		window.requestAnimationFrame(updater)
	}
	window.requestAnimationFrame(updater)
}
