
function main() {
	console.log("Starting game...")

	const terrain = Terrain()
	const actorSystem = ActorSystem(terrain)

	const createActor = () => {
		let actor = actorSystem.createActor()
		const x = Math.floor(Math.random() * terrain.width())
		const y = Math.floor(Math.random() * terrain.height())
		actor.setPosition(Vector(x, y))
	}
	createActor()
	createActor()
	createActor()
	createActor()
	createActor()

	window.requestAnimationFrame(elapsedTimeMillisecond =>
		actorSystem.update(elapsedTimeMillisecond)
	)
}
