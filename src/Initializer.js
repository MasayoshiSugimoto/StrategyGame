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

	const particleSystem = makeLazy(() => ParticleSystem(terrain(), 1.5, mouse()))
	const actorSystem = makeLazy(() => ActorSystem(terrain(), particleSystem()))
	const terrainRenderer = makeLazy(() => TerrainRenderer(terrain(), worldProjection()))
	const worldProjection = makeLazy(() => WorldProjection())
	const mouse = makeLazy(() => Mouse(worldProjection()))
	const terrain = makeLazy(() => Terrain(worldProjection(), TERRAIN_DATA))

	//Debug
	const frameMonitor = makeLazy(() => FrameMonitor(debugWindow()))
	const debugWindow = makeLazy(() => DebugWindow())

	return {
		worldProjection: worldProjection(),
		mouse: mouse(),
		terrain: terrain(),
		particleSystem: particleSystem(),
		actorSystem: actorSystem(),
		terrainRenderer: terrainRenderer(),
		frameMonitor: frameMonitor(),
	}

}
