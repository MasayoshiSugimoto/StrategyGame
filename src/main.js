function main() {
	console.log("Starting game...")

	const terrain = Terrain()
	const actorSystem = ActorSystem(terrain)
	const worldProjection = WorldProjection()

	const createActor = (targetId) => {
		let actor = actorSystem.createActor()
		const x = Math.floor(Math.random() * terrain.width())
		const y = Math.floor(Math.random() * terrain.height())
		actor.setPosition(Vector2D(x, y))

		const velocityMeterPerSecond = 1
		const mobilityComponent = MobilityComponent(actorSystem, actor, velocityMeterPerSecond)
		actor.setMobilityComponent(mobilityComponent)
		mobilityComponent.setTarget(targetId)

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
		terrainRenderer.render(screen.canvas())
		actorSystem.update(deltaTimeMillisecond, screen.canvas())
		window.requestAnimationFrame(updater)
	}
	window.requestAnimationFrame(updater)
}
