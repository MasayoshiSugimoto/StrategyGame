function DebugCollision(_actor) {

}

DebugCollision.enable = function(initializer) {
	initializer.actorSystem = ActorSystem()
	initializer.createActor = ActorFactory(
		initializer.actorSystem,
		initializer.terrain,
		initializer.worldProjection
	)
	initializer.createActor()
}
