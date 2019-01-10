function ActorFactory(actorSystem, terrain, worldProjection) {
	return () => {
		const x = Math.random() * terrain.width()
		const y = Math.random() * terrain.height()

		let actor = actorSystem.createActor()
		actor.setPosition(Vector2D(x, y))

		actor.addComponent(
			ActorComponentId.PARTICLE_SYSTEM,
			ParticleSystem.createComponent(actor.getPosition())
		)

		actor.addComponent(ActorComponentId.CIRCLE_RENDERER, CircleRendererComponent(
			actor,
			10,
			"white",
			worldProjection
		))

		actor.addComponent(ActorComponentId.NAVIGATION, NavigationSystem.createComponent())

		return actor
	}
}
