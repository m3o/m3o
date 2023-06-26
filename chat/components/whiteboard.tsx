import React from 'react'
import { v4 as uuid } from 'uuid'
import styles from './whiteboard.module.scss'

interface Props {
  id: string
}

interface State {
  isDrawing: boolean
  drawnIDs: string[]
  websocket?: WebSocket
}

export default class Whiteboard extends React.Component<Props, State> {
  readonly state: State = { isDrawing: false, drawnIDs: [] }
  readonly canvas: React.RefObject<HTMLCanvasElement>

  constructor(props: Props) {
    super(props)
    this.canvas = React.createRef<HTMLCanvasElement>()
  }

  componentWillUnmount() {
    if (!this.state.websocket) return
    this.state.websocket.close()
  }

  componentDidMount() {
    this.setupWebsocket()
  }

  async setupWebsocket() {
    const rsp = await fetch(`/api/whiteboard/${this.props.id}`, {
      method: 'GET',
    })
    const data = await rsp.json()

    const ws = new WebSocket(data.websocket.url)

    ws.onopen = () => {
      console.log('Whiteboard websocket opened')
      this.setState({ websocket: ws })
      this.setupCanvas()
      ws.send(
        JSON.stringify({
          token: data.websocket.token,
          topic: data.websocket.topic,
        })
      )
    }

    ws.onmessage = ({ data }) => {
      const event = JSON.parse(data)
      const rawPayload = JSON.parse(event.message)
      const payload = JSON.parse(rawPayload)

      if (this.state.drawnIDs.includes(payload.id)) {
        console.log(
          `Skipping whiteboard event ${payload.id}, message sent locally`
        )
        return
      }

      console.log(`Processing whiteboard event ${payload}`)
      const ctx = this.canvas.current?.getContext('2d')
      if (!ctx) {
        return
      }
      if (payload.status === 'move') {
        ctx.moveTo(payload.x, payload.y)
      } else if (payload.status === 'draw') {
        ctx.lineTo(payload.x, payload.y)
        ctx.stroke()
      }
    }

    ws.onclose = () => {
      console.log('Whiteboard websocket closed')
      // reconnect?
    }

    ws.onerror = () => {
      console.log('Whiteboard websocket errored')
    }
  }

  setupCanvas() {
    const ctx = this.canvas.current.getContext('2d')
    ctx.strokeStyle = 'red'
    ctx.beginPath()

    this.canvas.current.onmousedown = this.onMouseDown.bind(this)
    this.canvas.current.onmousemove = this.onMouseMove.bind(this)
    this.canvas.current.onmouseup = this.onMouseUp.bind(this)
  }

  onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    this.setState({ isDrawing: true })
    const ctx = this.canvas.current.getContext('2d')
    const rect = this.canvas.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    ctx.moveTo(x, y)
    this.sendEvent({ status: 'move', x, y, id: uuid() })
  }

  onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!this.state.isDrawing) return
    const ctx = this.canvas.current.getContext('2d')
    const rect = this.canvas.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    ctx.lineTo(x, y)
    ctx.stroke()
    this.sendEvent({ status: 'draw', x, y, id: uuid() })
  }

  sendEvent(data: {
    x: number
    y: number
    status: 'move' | 'draw'
    id: string
  }) {
    this.setState({ drawnIDs: [...this.state.drawnIDs, data.id] })
    fetch(`/api/whiteboard/${this.props.id}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  onMouseUp() {
    this.setState({ isDrawing: false })
  }

  render(): JSX.Element {
    if (!this.state.websocket) return null
    return (
      <canvas
        height={400}
        width={400}
        ref={this.canvas}
        className={styles.whiteboard}
      />
    )
  }
}
