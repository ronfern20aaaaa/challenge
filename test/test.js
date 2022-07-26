import {fireEvent, getByTestId} from "@testing-library/dom"
import "@testing-library/jest-dom/extend-expect"
import jsdom, {JSDOM} from "jsdom"
import path from "path"

const BASE = path.resolve(__dirname, "../src")

let virtualConsole
let dom, body

describe("image carousel test", function () {
  beforeEach(async () => {
    virtualConsole = new jsdom.VirtualConsole()
    virtualConsole.on("error", console.error)
    dom = await JSDOM.fromFile(`${BASE}/index.html`, {
      runScripts: "dangerously",
      resources: "usable",
      pretendToBeVisual: true,
      virtualConsole
    })
    await loadDom(dom)
    body = dom.window.document.body
  })

  it('should contain 20 buttons', async () => {
    const container = getByTestId(body, "button-container")
    expect(container.children.length).toEqual(20)
  })

  it('should contain buttons with correct text', async () => {
    const container = getByTestId(body, "button-container")
    for (let i = 0; i < 20; i++) {
      const button = container.children[i]
      expect(innerText(button)).toEqual(`Button #${i + 1}`)
    }
  })

  it('should display correct alert on button click', async () => {
    const container = getByTestId(body, "button-container")

    jest.spyOn(dom.window, 'alert').mockImplementation(() => {
    })

    for (let i = 0; i < 20; i++) {
      const button = container.children[i]
      await fireEvent.click(button)

      expect(dom.window.alert).toHaveBeenCalled()
      const parameter = dom.window.alert.mock.calls[0][0]
      expect(parameter.toString()).toEqual((i + 1).toString())
      dom.window.alert.mockReset()
    }
  })
})


function loadDom(dom) {
  return new Promise((resolve, _) => {
    virtualConsole.on("log", log => {
      if (log === "DOM Loaded") resolve(dom)
    })
  })
}

function innerText(node) {
  return (node.innerText || node.textContent || node.innerHTML).toString()
}