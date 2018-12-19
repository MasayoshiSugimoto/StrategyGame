function ActorFactory(actorSystem, terrain, particleSystem, worldProjection) {
	return () => {
		let actor = actorSystem.createActor()

		const x = Math.random() * terrain.width()
		const y = Math.random() * terrain.height()
		particleSystem.createParticle(Vector2D(x, y), actor.id())

		actor.addRenderComponent(CircleRendererComponent(
			actor,
			10,
			"white",
			worldProjection
		))
		
		return actor
	}
}
