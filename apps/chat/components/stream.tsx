import { Component, createRef } from 'react'
import Twilio from 'twilio-video'
import { User } from '../lib/user'
import { getVideoProfile } from '../lib/videos'
import styles from './stream.module.scss'

interface Props {
    // the room id is used as the identifier for the twilio video call
    roomID: string
    // audio indicates if the user has enabled their audio input
    audio?: boolean
    // video indicates if the user has enabled their video input
    video?: boolean
    // className which can be optionally provided to add additonal styling to the stream component
    className?: string
    // the participants in the stream, this is used to add labels to the stream such as user name etc
    participants: User[]
}

interface State {
    // the twilio room which contains the connection
    room?: any
    // the token which must be used to authenticate when connecting to the room
    token?: string
    // the identity of the current user
    identity?: string
    // the participants in the stream, grouped by their ID. This is initially populated using the
    // participant prop but also contains a reference to the users connection, enabling access to the
    // video and audio streams.
    participants?: Record<string, Participant>
    // the connection is being established to twilio, this should only happen once
    connecting: boolean
}

interface Participant {
    // the time at which the user connected to the stream, this is used to sequence the participants
    // in the user interface, ensuring new users are added to the end of the list
    connectedAt?: number
    // the connection object containing links to the various media tracks
    connection: any
    // the metadata for the user
    user: User
}

export default class Stream extends Component<Props, State> {
    constructor(props: Props) {
        super(props)

        // populate the participants object in the state
        const participants = (props.participants || []).reduce(
            (result, user) => ({ ...result, [user.id]: { user } }),
            {}
        )
        this.state = { participants, connecting: false }

        // these functions require access to the components state and therefore must be bound to it
        this.roomJoined = this.roomJoined.bind(this)
        this.disconnectRoom = this.disconnectRoom.bind(this)
    }

    componentDidMount() {
        // disconnect from the video stream when the tab is closed, improving the disconnection experience
        // for other users in the room
        window.addEventListener('beforeunload', this.disconnectRoom)

        // get the token and identity from the API
        if (process.env.TWILIO_API_KEY?.length > 0) {
            getVideoProfile()
                .then((profile) => this.setState({ ...profile }))
                .catch((err) =>
                    alert(`Error loading video credentials: ${err}`)
                )
        }
    }

    componentWillUnmount() {
        this.disconnectRoom()
        window.removeEventListener('beforeunload', this.disconnectRoom)
    }

    async componentDidUpdate(prevProps?: Props) {
        // if the participants is updated (e.g. a user joined or left the group), update the state object
        if (
            prevProps.participants?.length !== this.props.participants?.length
        ) {
            const participants = {}
            this.props.participants.forEach((p) => {
                const e = this.state.participants[p.id]
                participants[p.id] = e || { user: p }
            })
            this.setState({ participants })
            return
        }

        // the rest of this function handles video and audio streams being connected, if there is no token
        // set, the call to Twilio will fail.
        if (!this.state.token) return

        // disconnect from the old room if joining a new room. this will happen when switching from one
        // room to another if the key prop is not changed.
        const { roomID, audio, video } = this.props
        const { room, token } = this.state
        if (roomID !== prevProps?.roomID && room) this.disconnectRoom()

        // todo: find a cleaner way to share this info globally. this is used in `pages/groups/[id].tsx`
        // to conditionally warn the user if they try to switch to another room whilst still connected
        // to video or audio in the current room.
        window.audioEnabled = audio
        window.videoEnabled = video

        const tracksToAdd = []
        if (
            audio &&
            room &&
            Array.from(room.localParticipant.audioTracks).length === 0
        ) {
            // if the local audio track is not published, and the user has it enabled, we need to add this
            // track to the connection
            tracksToAdd.push(await Twilio.createLocalAudioTrack())
        } else if (room && !audio) {
            // if the user has switched off their audio, we'll unpublish their audio tracks
            Array.from(room.localParticipant.audioTracks)
                .map((t) => t[1].track)
                .forEach((t) => {
                    t.stop()
                    room.localParticipant.unpublishTrack(t)
                })
        }

        if (
            video &&
            room &&
            Array.from(room.localParticipant.videoTracks).length === 0
        ) {
            // if the local video track is not published, and the user has it enabled, we need to add this
            // track to the connection
            tracksToAdd.push(await Twilio.createLocalVideoTrack())
        } else if (room && !video) {
            // if the user has switched off their video, we'll unpublish their video tracks
            Array.from(room.localParticipant.videoTracks)
                .map((t) => t[1].track)
                .forEach((t) => {
                    t.stop()
                    room.localParticipant.unpublishTrack(t)
                })
        }

        if (room) {
            // if we are already connected to a Twilio room, publish new tracks to the existing room
            await Promise.all(
                tracksToAdd.map((t) => room.localParticipant.publishTrack(t))
            )
        } else if (!this.state.connecting) {
            // the room has not yet been connected so we can add the tracks whilst connecting to the room
            // at the same time
            console.log(`Connecting with ${tracksToAdd.length} tracks`)
            this.setState({ connecting: true })
            await Twilio.connect(token, {
                name: roomID,
                tracks: tracksToAdd,
            }).then(this.roomJoined, (error) => {
                alert('Could not connect to Twilio: ' + error.message)
            })
        }
    }

    disconnectRoom() {
        if (!this.state.room) return
        console.log(`Leaving room: ${this.props.roomID}...`)
        this.state.room.disconnect()
        this.setState({ room: undefined, participants: {}, connecting: false })
    }

    attachTracks(trackPubs: any[]) {
        trackPubs.forEach((pub) => {
            if (pub.isSubscribed) {
                console.log('already subscribed to: ', pub.trackName)
                return
            }

            // handle local track which does not get subscribed to
            if (pub.track) {
                pub.track.attach().muted = true
                return
            }
        })
    }

    roomJoined(room) {
        console.log('Joined room', room)
        this.setState({ room, connecting: false })

        // Attach LocalParticipant's tracks
        const trackPubs = Array.from(room.localParticipant.tracks.values())
        this.attachTracks(trackPubs)

        // Attach the tracks of the room's participants.
        const participants = { ...this.state.participants }
        participants[this.state.identity].connection = room.localParticipant
        participants[this.state.identity].connectedAt = Date.now()
        room.participants.forEach((participant) => {
            console.log("Already in Room: '" + participant.identity + "'")
            const trackPubs = Array.from(participant.tracks.values())
            this.attachTracks(trackPubs)
            participants[participant.identity].connection = participant
            participants[participant.identity].connectedAt = Date.now()
        })
        this.setState({ participants })

        // Participant joining room
        room.on('participantConnected', (participant) => {
            console.log("Joining: '" + participant.identity + "'")
            const trackPubs = Array.from(participant.tracks.values())
            this.attachTracks(trackPubs)
            this.setState({
                participants: {
                    ...this.state.participants,
                    [participant.identity]: {
                        ...this.state.participants[participant.identity],
                        connectedAt: Date.now(),
                        connection: participant,
                    },
                },
            })
        })

        // Attach participant’s tracks to DOM when they add a track
        room.on('trackAdded', (track, participant) => {
            console.log(participant.identity + ' added track: ' + track.kind)
            this.attachTracks([track])
        })

        // Detach all participant’s track when they leave a room.
        room.on('participantDisconnected', (participant) => {
            console.log(
                "Participant '" + participant.identity + "' left the room"
            )
            this.setState({
                participants: {
                    ...this.state.participants,
                    [participant.identity]: {
                        ...this.state.participants[participant.identity],
                        connected: false,
                        connectedAt: undefined,
                    },
                },
            })
        })
    }

    render() {
        const identity = this.state.identity
        const participants = Object.values(this.state.participants)
            .filter((p) => !!p.connectedAt)
            .sort((a, b) => a.connectedAt - b.connectedAt)

        return (
            <div className={`${this.props.className} ${styles.container}`}>
                {participants.map((p) => {
                    return (
                        <ParticipantComponent
                            key={p.user.id}
                            participant={p}
                            muted={p.user.id === identity}
                            videoEnabled={true}
                        />
                    )
                })}
            </div>
        )
    }
}

interface ParticipantProps {
    muted: boolean
    participant: Participant
    videoEnabled: boolean
}

class ParticipantComponent extends Component<ParticipantProps> {
    readonly state: {
        size?: number
        audioEnabled: boolean
        videoEnabled: boolean
    }
    readonly videoRef = createRef<HTMLVideoElement>()
    readonly audioRef = createRef<HTMLAudioElement>()

    constructor(props: ParticipantProps) {
        super(props)
        this.state = { size: 0, audioEnabled: false, videoEnabled: false }
        this.onClick = this.onClick.bind(this)
        this.connectTrack = this.connectTrack.bind(this)
        this.disconnectTrack = this.disconnectTrack.bind(this)
    }

    // connect the audio/video source to the participants media track
    connectTrack(x: any) {
        if (!x.track && !x.attach) return

        try {
            console.log(
                'connect',
                x.kind,
                x.attach().srcObject,
                this.videoRef.current
            )

            if (x.kind === 'audio') {
                this.setState({ audioEnabled: true })
                this.audioRef.current.srcObject = x.track
                    ? x.track.attach().srcObject
                    : x.attach().srcObject
            } else {
                this.setState({ videoEnabled: true })
                this.videoRef.current.srcObject = x.track
                    ? x.track.attach().srcObject
                    : x.attach().srcObject
            }
        } catch (error) {
            console.warn(error)
        }
    }

    // the participant has stopped publishing a track, disconnect from it
    disconnectTrack(x: any) {
        if (x.kind === 'audio') {
            this.audioRef.current.srcObject = undefined
            this.setState({ audioEnabled: false })
        } else {
            this.videoRef.current.srcObject = undefined
            this.setState({ videoEnabled: false })
        }
    }

    componentDidMount() {
        // the local participant should be muted (you don't need to hear yourself)
        this.audioRef.current.muted = this.props.muted
        this.videoRef.current.muted = this.props.muted

        this.props.participant.connection.tracks.forEach(this.connectTrack)
        this.props.participant.connection.on('trackStarted', this.connectTrack)
        this.props.participant.connection.on(
            'trackStopped',
            this.disconnectTrack
        )
        this.props.participant.connection.on(
            'trackUnpublished',
            this.disconnectTrack
        )
    }

    componentDidUpdate(prevProps: ParticipantProps) {
        if (prevProps.muted !== this.props.muted) {
            this.audioRef.current.muted = this.props.muted
            this.videoRef.current.muted = this.props.muted
        }
    }

    // make the UI bigger when the participant is clicked. There are 3 sizes: small, medium and large.
    // when the user clicks on the large UI, it circles back to the small UI.
    onClick(): void {
        let size = this.state.size + 1
        if (size > 2) size = 0
        this.setState({ size })
    }

    render(): JSX.Element {
        const { audioEnabled, videoEnabled } = this.state
        const { participant } = this.props
        const sizeStyle = {
            0: styles.small,
            1: styles.medium,
            2: styles.large,
        }[this.state.size]

        // Note: do not set muted when rendering the video / audio components:
        // https://github.com/facebook/react/issues/10389
        return (
            <div
                className={`${styles.participant} ${sizeStyle}`}
                onClick={this.onClick}
            >
                <audio autoPlay ref={this.audioRef} />
                <video
                    style={videoEnabled ? {} : { display: 'none' }}
                    autoPlay
                    playsInline
                    ref={this.videoRef}
                />
                {videoEnabled ? null : <p>{participant.user.first_name}</p>}
                {videoEnabled ? null : (
                    <p className={styles.icons}>
                        {audioEnabled ? <span>🎤</span> : null}
                        {videoEnabled ? <span>🎥</span> : null}
                    </p>
                )}
            </div>
        )
    }
}
