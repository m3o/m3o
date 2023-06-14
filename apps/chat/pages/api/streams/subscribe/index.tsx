import { NextApiRequest } from 'next'
import WebSocket from 'ws'
import { APIKey, BaseURL } from '../../../../lib/micro'

export default async function handler(req: NextApiRequest) {
    return new Promise((resolve) => {
        let wsToMicro = null
        let connectionClosed = false
        const wss = new WebSocket.Server({ noServer: true })
        wss.on('error', (error) => {
            console.error('connection error to client ' + JSON.stringify(error))
            if (wsToMicro) {
                wsToMicro.close()
            }
            if (wss) {
                wss.close()
            }
        })
        wss.on('close', () => {
            console.log('websocket to client closed')
            connectionClosed = true
            if (wsToMicro) {
                wsToMicro.close()
            }
        })
        wss.on('connection', (wss) => {
            wss.on('message', (data) => {
                let protocol = 'ws'

                if (
                    req.headers.referer &&
                    req.headers.referer.startsWith('https:')
                ) {
                    protocol = 'wss'
                }

                console.log(
                    'connecting to ' +
                        BaseURL.replace('http', 'ws') +
                        '/streams/subscribe'
                )

                // set up connection to micro
                wsToMicro = new WebSocket(
                    BaseURL.replace('http', 'ws') + '/streams/subscribe',
                    [],
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + APIKey,
                        },
                    }
                )
                wsToMicro.on('error', (error) => {
                    console.error(
                        'connection error to micro ' + JSON.stringify(error)
                    )
                    if (wsToMicro) {
                        wsToMicro.close()
                    }
                    if (wss) {
                        wss.close()
                    }
                })
                wsToMicro.on('close', () => {
                    wss.close()
                })
                wsToMicro.on('open', () => {
                    try {
                        wsToMicro.send(data)
                    } catch (e) {
                        console.error(
                            'Error while sending data to micro ' +
                                JSON.stringify(e)
                        )
                    }
                })
                wsToMicro.on('message', (data) => {
                    try {
                        wss.send(data)
                    } catch (e) {
                        console.error(
                            'Error while sending data to client ' +
                                JSON.stringify(e)
                        )
                    }
                })
            })
            wss.on('close', () => {
                console.log('upgraded websocket to client closed')
                connectionClosed = true
                if (wsToMicro) {
                    wsToMicro.close()
                }
            })
        })

        wss.handleUpgrade(req, req.socket, req.headers, (wssInput) => {
            wssInput.on('error', (error) => {
                console.error(
                    'connection error on upgraded socket ' +
                        JSON.stringify(error)
                )
                if (wsToMicro) {
                    wsToMicro.close()
                }
                if (wss) {
                    wss.close()
                }
            })
            wss.emit('connection', wssInput, req)
        })

        function checkClosed() {
            if (connectionClosed) {
                resolve(null)
                return
            }
            setTimeout(checkClosed, 5000)
        }
        checkClosed()
    })
}
