
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
	}
	createActor(4)
	createActor(0)
	createActor(1)
	createActor(2)
	createActor(3)

	const intervalMillisecond = 200
	window.setInterval(() => actorSystem.update(intervalMillisecond), intervalMillisecond)
//	window.requestAnimationFrame(elapsedTimeMillisecond =>
//		actorSystem.update(elapsedTimeMillisecond)
//	)
}
