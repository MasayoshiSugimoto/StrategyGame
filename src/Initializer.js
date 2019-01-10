function Initializer() {

	function makeLazy(f) {
		let instance = null
		return () => {
			if (instance === null) {
				instance = f()
			}
			return instance
		}
	}

	const particleSystem = makeLazy(() => ParticleSystem(
		terrain(),
		1.5, //restLength
		mouse(),
		collisionRectangles())
	)

	const actorSystem = makeLazy(() => ActorSystem(particleSystem()))

	const terrainRenderer = makeLazy(() => TerrainRenderer(
		terrain(),
		worldProjection(),
		screen().canvas())
	)

	const worldProjection = makeLazy(() => WorldProjection())
	const mouse = makeLazy(() => Mouse(worldProjection()))
	const terrain = makeLazy(() => Terrain(TERRAIN_DATA))
	const screen = makeLazy(() => Screen())

	const collisionRectangles = makeLazy(() =>
		Terrain.optimizeCollisionData(Terrain.string2Data(TERRAIN_DATA))
	)

	const createActor = makeLazy(() => ActorFactory(
		actorSystem(),
		terrain(),
		worldProjection()
	))

	const navigationSystem = makeLazy(() => NavigationSystem(
		mouse(),
		terrain()
	))

	//Debug
	const frameMonitor = makeLazy(() => FrameMonitor(debugWindow()))
	const debugWindow = makeLazy(() => DebugWindow())

	const collisionRenderer = makeLazy(() => CollisionRenderer(
		screen().canvas(),
		worldProjection(),
		collisionRectangles()
	))

	const debugPath = makeLazy(() => DebugPath(
		screen().canvas(),
		worldProjection(),
		terrain(),
		mouse(),
		debugWindow()
	))

	return {
		worldProjection: worldProjection(),
		mouse: mouse(),
		terrain: terrain(),
		particleSystem: particleSystem(),
		actorSystem: actorSystem(),
		terrainRenderer: terrainRenderer(),
		frameMonitor: frameMonitor(),
		screen: screen(),
		collisionRenderer: collisionRenderer(),
		createActor: createActor(),
		debugPath: debugPath(),
		navigationSystem: navigationSystem()
	}

}
