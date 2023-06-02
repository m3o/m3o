import moment from 'moment'
import Linkify from 'react-linkify'
import { TwitterTweetEmbed } from 'react-twitter-embed'
import { Message as Msg } from '../lib/message'
import styles from './message.module.scss'
import Whiteboard from './whiteboard'

interface Props {
  data: Msg
}

export default function Message({ data }: Props) {
  let inner: JSX.Element
  const comps = data.text.split(' ')
  if (comps.length === 1 && comps[0].includes('youtube.com/watch?')) {
    // embed YouTube videos
    const params = parseQuery(comps[0].split('?')[1] || '')
    inner = (
      <iframe
        frameBorder="0"
        allowFullScreen
        src={`https://www.youtube.com/embed/${params['v']}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    )
  } else if (comps.length === 1 && comps[0].includes('youtu.be')) {
    const id = comps[0].split('.be/')[1].split('?')[0]
    inner = (
      <iframe
        frameBorder="0"
        allowFullScreen
        src={`https://www.youtube.com/embed/${id}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    )
  } else if (comps.length === 1 && comps[0].includes('open.spotify.com/')) {
    // embed Spotify playlists / tracks
    const urlComps = (comps[0].split('?')[0] || '').split('/')
    const type = urlComps[urlComps.length - 2]
    const id = urlComps[urlComps.length - 1]
    inner = (
      <iframe
        frameBorder="0"
        allowTransparency
        allow="encrypted-media;"
        src={`https://open.spotify.com/embed/${type}/${id}`}
      />
    )
  } else if (comps.length === 1 && comps[0].includes('twitter.com')) {
    const id = comps[0].split('/').pop().split("?")[0]
    inner = <TwitterTweetEmbed tweetId={`${id}`} />
  } else if (comps.length === 1 && comps[0].match(/\.(jpeg|jpg|gif|png)$/)) {
    inner = <img src={data.text} width="300" height="auto" />
  } else if (data.text === 'whiteboard') {
    inner = <Whiteboard id={data.id} />
  } else {
    inner = (
      <p className={styles.text}>
        <Linkify componentDecorator={linkifyDecorator}>{data.text}</Linkify>
      </p>
    )
  }

  return (
    <div
      className={
        data.author.current_user
          ? [styles.container, styles.isAuthor].join(' ')
          : styles.container
      }
    >
      <div className={styles.upper}>
        <p className={styles.author}>
          {data.author.first_name} {data.author.last_name}
        </p>
        <p className={styles.sentAt}>
          <time dateTime={data.sent_at as string}>
            {moment(data.sent_at).format('LT')}
          </time>
        </p>
      </div>
      {inner}
    </div>
  )
}

function parseQuery(queryString) {
  const query = {}
  const pairs = (queryString[0] === '?'
    ? queryString.substr(1)
    : queryString
  ).split('&')
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=')
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
  }
  return query
}

// decorator for making Linkify links open in a new tab
const linkifyDecorator = (href, text, key) => (
  <a href={href} key={key} target="_blank" rel="noopener noreferrer">
    {text}
  </a>
)
