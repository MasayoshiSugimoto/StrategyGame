
function main() {
	console.log("Starting game...")

	const terrain = Terrain()
	const actorSystem = ActorSystem(terrain)

	const createActor = (targetId) => {
		let actor = actorSystem.createActor()
		const x = Math.floor(Math.random() * terrain.width())
		const y = Math.floor(Math.random() * terrain.height())
		actor.setPosition(Vector(x, y))

		const mobilityComponent = MobilityComponent(actorSystem, actor)
		actor.setMobilityComponent(mobilityComponent)
		mobilityComponent.setTarget(targetId)

		actor.addRenderComponent(CircleRendererComponent(actor, 10, "white"))
	}
	createActor(4)
	createActor(0)
	createActor(1)
	createActor(2)
	createActor(3)

	const screen = Screen()
	const intervalMillisecond = 100
	const updater = () => {
		screen
				.fullScreen()
				.setBackgroundColor("black")
		actorSystem.update(intervalMillisecond, screen.canvas())
	}
	window.setInterval(updater, intervalMillisecond)
}
