function main() {
	console.log("Starting game...")

	const worldProjection = WorldProjection()
	const terrain = Terrain(worldProjection)
	const actorSystem = ActorSystem(terrain)

	const createActor = (targetId) => {
		let actor = actorSystem.createActor()
		const x = Math.random() * terrain.width()
		const y = Math.random() * terrain.height()
		actor.setPosition(Vector2D(x, y))

		const velocityMeterPerSecond = 2.0
		const mobilityComponent = MobilityComponent(
				actorSystem,
				actor,
				velocityMeterPerSecond,
				terrain)
		actor.setMobilityComponent(mobilityComponent)
		mobilityComponent.setTarget(targetId)

		actor.addRenderComponent(CircleRendererComponent(actor, 10, "white", worldProjection))

		const healthComponent = HealthComponent(100, 100)
		actor.setHealthComponent(healthComponent)
		actor.addRenderComponent(HPBarRendererComponent(actor, healthComponent, worldProjection))
	}
	const actorMax = 10
	for (let i = 0; i < actorMax; i++) {
		createActor((actorMax+1)%actorMax)
	}

	const terrainRenderer = TerrainRenderer(terrain, worldProjection)

	const screen = Screen()
	let lastTimeStamp = 0
	const updater = timeStampMillisecond => {
		const deltaTimeMillisecond = timeStampMillisecond - lastTimeStamp
		lastTimeStamp = timeStampMillisecond
		screen
				.fullScreen()
				.setBackgroundColor("black")
		actorSystem.apply(terrain.update)
		terrainRenderer.render(screen.canvas())
//		terrain.renderForceField(screen.canvas())
		actorSystem.update(deltaTimeMillisecond, screen.canvas())
		window.requestAnimationFrame(updater)
	}
	window.requestAnimationFrame(updater)
}
