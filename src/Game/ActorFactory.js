function ActorFactory(actorSystem, terrain, particleSystem, worldProjection) {
	return () => {
		let actor = actorSystem.createActor()

		const x = Math.random() * terrain.width()
		const y = Math.random() * terrain.height()
		particleSystem.createParticle(Vector2D(x, y), actor.id())

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
