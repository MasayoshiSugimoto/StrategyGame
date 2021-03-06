function ActorFactory(actorSystem, terrain, worldProjection) {
	return () => {
		const x = Math.random() * terrain.width()
		const y = Math.random() * terrain.height()

		const actor = actorSystem.createActor()
		actor.setPosition(Vector2D(x, y))

		actor.addComponent(
			ActorComponentId.PARTICLE_SYSTEM,
			ParticleSystem.createComponent(actor.getPosition(), NavigationSystem.actorAcceleration)
		)

		actor.addComponent(ActorComponentId.CIRCLE_RENDERER, CircleRendererComponent(
			actor,
			10,
			"red",
			worldProjection
		))

		actor.addComponent(ActorComponentId.NAVIGATION, NavigationSystem.createComponent())

		return actor
	}
}
