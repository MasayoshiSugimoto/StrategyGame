function HealthComponent(hp, maxHP) {
	let _hp = hp
	let _maxHP = maxHP
	let _events = []

	function update() {
		_events.forEach(event => event())
		_events = []
		_hp = Math.min(_hp, _maxHP)
	}

	function damage(hp) {
		_events.push(() => _hp -= hp)
	}

	function heal(hp) {
		_events.push(() => _hp += hp)
	}

	return {update, damage, heal}
}
