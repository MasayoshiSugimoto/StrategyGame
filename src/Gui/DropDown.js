function DropDown(_id, _labelName, _listItems, _defaultIndex) {

	let _ignoreFirst = true
	
	function getDropDown() { return document.getElementById(_id) }

	function show() {
		_listContent.style.display = "block"
		_ignoreFirst = true
		document.addEventListener("click", hide)
	}

	function hide() {
		if (_ignoreFirst) {
			_ignoreFirst = false
		} else {
			_listContent.style.display = "none"
			document.removeEventListener("click", hide)
		}
	}

	const dropDown = getDropDown()
	const button = document.createElement("button")
	{
		const label = document.createElement("label")

		button.onclick = show
		button.innerText = _listItems[_defaultIndex].text

		dropDown.appendChild(label)
		label.appendChild(button)
		label.appendChild(document.createTextNode(_labelName))
	}

	const _listContent = document.createElement("div")
	{
		_listContent.style.display = "none"
		_listContent.classList.add("drop_down_list")
		_listItems.forEach(item => {
			const div = document.createElement("div")
			div.classList.add("drop_down_list_item")
			div.innerText = item.text
			div.onclick = () => {
				button.innerText = item.text
				item.handler()
			}
			_listContent.appendChild(div)
		})
		dropDown.appendChild(_listContent)
	}
}
