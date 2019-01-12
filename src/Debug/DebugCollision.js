function DebugCollision(_actor) {

}

DebugCollision.enable = function(initializer) {
	initializer.actorSystem = ActorSystem()

	const actor = initializer.actorSystem.createActor()
	actor.addComponent(ActorComponentId.CIRCLE_RENDERER, CircleRendererComponent(
		actor,
		10,
		"green",
		initializer.worldProjection
	))

	function calculateAcceleration(actor) {
		if (initializer.mouse.position().equals(actor.getPosition())) return undefined
		const MAX_ACCELERATION = 10.0
		return initializer.mouse.position()
				.substract(actor.getPosition())
				.resize(MAX_ACCELERATION)
	}
	actor.addComponent(ActorComponentId.PARTICLE_SYSTEM, ParticleSystem.createComponent(
		actor.getPosition(),
		calculateAcceleration
	))
}
