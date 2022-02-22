import { useState } from 'react'
import M3O from 'm3o'

const m3o = M3O('MjU4NTMyMDMtNTdlZS00ZGEyLTlhN2EtZWViZjQzMGQwYzBh')

/*
  Widget Screen:
  -> First step create hello world widget.
  -> The widgets need to be compiled to pure JS.
  -> The widgets need to be in two modes edit and test mode.
*/

const MODES = {
  test: 'Test',
  edit: 'Edit',
}

export function WidgetScreen() {
  const [mode, setMode] = useState(MODES.edit)

  function handleWidgetClick() {
    if (mode === MODES.test) return
  }

  return (
    <div>
      <div>
        <button onClick={() => setMode(MODES.edit)}>{MODES.edit}</button>
        <button onClick={() => setMode(MODES.test)}>{MODES.test}</button>
      </div>

      <div onClick={handleWidgetClick}>
        {/* Widget below */}
        <div>
          <h2>Hello World</h2>
          <input />
        </div>
      </div>
    </div>
  )
}
