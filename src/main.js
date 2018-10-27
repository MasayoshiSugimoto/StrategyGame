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

		const velocityMeterPerSecond = 0.2
//		const mobilityComponent = MobilityComponent(actorSystem, actor, velocityMeterPerSecond)
//		actor.setMobilityComponent(mobilityComponent)
//		mobilityComponent.setTarget(targetId)

		actor.addRenderComponent(CircleRendererComponent(actor, 10, "white", worldProjection))

		const healthComponent = HealthComponent(100, 100)
		actor.setHealthComponent(healthComponent)
		actor.addRenderComponent(HPBarRendererComponent(actor, healthComponent, worldProjection))
	}
	createActor(4)
	createActor(0)
	createActor(1)
	createActor(2)
	createActor(3)

	const terrainRenderer = TerrainRenderer(terrain, worldProjection)

	const screen = Screen()
	const updater = deltaTimeMillisecond => {
		screen
				.fullScreen()
				.setBackgroundColor("black")
		actorSystem.apply(terrain.update)
		terrainRenderer.render(screen.canvas())
		terrain.renderForceField(screen.canvas())
		actorSystem.update(deltaTimeMillisecond, screen.canvas())
		window.requestAnimationFrame(updater)
	}
	window.requestAnimationFrame(updater)
}
