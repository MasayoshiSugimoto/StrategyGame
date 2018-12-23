function DebugPathRenderer(_canvas, _worldProjection) {

  function getDropDownList() {
    return document.getElementById("debug_mode_drop_down_list")
  }

  function getModeSelectButton() {
    return document.getElementById("debug_mode_select_button")
  }

  let _ignoreFirst = true
  let _debugMode = "Normal Mode"

  function show() {
    getDropDownList().style.display = "block"
    _ignoreFirst = true
    document.addEventListener("click", hide)
  }

  function hide() {
    if (_ignoreFirst) {
      _ignoreFirst = false
    } else {
      getDropDownList().style.display = "none"
      document.removeEventListener("click", hide)
    }
  }

  function setNormalMode() {
    getModeSelectButton().innerText = "Normal Mode"
    _debugMode = "Normal Mode"
  }

  function setPathDebugMode() {
    getModeSelectButton().innerHTML = "Path Debug Mode"
    _debugMode = "Path Debug Mode"
  }

  const dropDownButton = getModeSelectButton()
  dropDownButton.onclick = show

  const dropDownList = getDropDownList()
  {
    const normalMode = document.createElement("div")
    normalMode.innerText = "Normal Mode"
    normalMode.classList.add("drop_down_list_element")
    normalMode.onclick = setNormalMode
    dropDownList.appendChild(normalMode)
  }
  {
    const pathDebugMode = document.createElement("div")
    pathDebugMode.innerText = "Path Debug Mode"
    pathDebugMode.classList.add("drop_down_list_element")
    pathDebugMode.onclick = setPathDebugMode
    dropDownList.appendChild(pathDebugMode)
  }

  function render() {
    if (_debugMode !== "Path Debug Mode") return

    
  }

  return {render}
}