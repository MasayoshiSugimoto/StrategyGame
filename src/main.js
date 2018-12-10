function main() {
	console.log("Starting game...")

	const worldProjection = WorldProjection()
	const mouse = Mouse(worldProjection)
	const terrain = Terrain(worldProjection, TERRAIN_DATA)
	const particleSystem = ParticleSystem(
		terrain,
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
	const actorMax = 1
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
		//terrainRenderer.render(screen.canvas())
		Terrain.renderCollisionData(
				screen.canvas(),
				worldProjection,
				Terrain.optimizeCollisionData(Terrain.string2Data(`
000000000000000
010001111100000
000001111100000
000001111100000
000000000000000
000000000011111
000000000011111
`)))
		const deltaTimeSecond = deltaTimeMillisecond / 1000.0
		particleSystem.update(deltaTimeMillisecond)
		//actorSystem.update(deltaTimeMillisecond, screen.canvas())
		frameMonitor.onFrameDone(deltaTimeMillisecond)
		//window.requestAnimationFrame(updater)
	}
	window.requestAnimationFrame(updater)
}
