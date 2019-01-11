function main() {
	console.log("Starting game...")

	const initializer = Initializer()

	for (let i = 0; i < 1; i++) {
		initializer.createActor()
	}

	let lastTimeStamp = 0
	const updater = timeStampMillisecond => {
		const deltaTimeMillisecond = timeStampMillisecond - lastTimeStamp
		lastTimeStamp = timeStampMillisecond

		const actors = initializer.actorSystem.getActors()

		//Game update
		initializer.particleSystem.update(deltaTimeMillisecond, actors)
		initializer.debugPath.update()
		initializer.navigationSystem.update(actors)

		//Rendering
		initializer.screen.reset()
		initializer.terrainRenderer.render()
		initializer.collisionRenderer.render()
		initializer.debugPath.render()
		renderCircleComponents(actors, initializer.screen.canvas())
		initializer.frameMonitor.onFrameDone(deltaTimeMillisecond)

		debugTarget(initializer.actorSystem)

		window.requestAnimationFrame(updater)
	}
	window.requestAnimationFrame(updater)
}

function debugTarget(actorSystem) {
	const canvas = document.getElementById("screen").getContext("2d")
	canvas.save()
	canvas.strokeStyle = "green"
	const worldProjection = WorldProjection()
	actorSystem.getActors().forEach(actor => {
		const navigationComponent = actor.getComponent(ActorComponentId.NAVIGATION)
		const target = navigationComponent && navigationComponent.target
		if (target !== undefined) {
			drawVector(
				canvas,
				worldProjection.toScreenCoordinates(actor.getPosition()),
				worldProjection.toScreenCoordinates(target)
			)
		}
	})
	canvas.restore()
}

