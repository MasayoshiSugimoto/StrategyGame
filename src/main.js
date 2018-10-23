
function main() {
	console.log("Starting game...")

	const actorSystem = ActorSystem()
	{
		let actor = actorSystem.createActor()
		actor.setPosition(Vector(0.0, 0.0))
	}
	{
		let actor = actorSystem.createActor()
		actor.setPosition(Vector(1.0, 1.0))
	}
	{
		let actor = actorSystem.createActor()
		actor.setPosition(Vector(2.0, 2.0))
	}
	{
		let actor = actorSystem.createActor()
		actor.setPosition(Vector(3.0, 3.0))
	}
	{
		let actor = actorSystem.createActor()
		actor.setPosition(Vector(4.0, 4.0))
	}

	window.requestAnimationFrame(elapsedTimeMillisecond =>
		actorSystem.update(elapsedTimeMillisecond)
	)
}
