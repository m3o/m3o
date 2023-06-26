import { useRouter } from 'next/router'
import { useState } from 'react'
import Layout from '../../components/layout'
import { useGroups, createGroup } from '../../lib/group'
import styles from './new.module.scss'

export default function Home() {
  const router = useRouter()
  const groupsLoader = useGroups()

  const [name, setName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  // todo: improve error handling
  if (groupsLoader.error) {
    router.push('/error')
    return <div />
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      await createGroup(name)
      router.push('/')
    } catch ({ error, code }) {
      console.warn(error)
      setLoading(false)
    }
  }

  return (
    <Layout className={styles.container} loading={groupsLoader.loading}>
      <h1 className={styles.title}>
        {groupsLoader.groups?.length
          ? 'Create a group'
          : 'Create your first group'}
      </h1>

      <form onSubmit={onSubmit}>
        <label>Name</label>
        <input
          required
          type="text"
          value={name}
          minLength={1}
          maxLength={100}
          disabled={loading}
          onChange={(e) => setName(e.target.value || '')}
        />

        <input
          type="submit"
          value="Create group"
          disabled={loading || name.length === 0}
        />
      </form>
    </Layout>
  )
}
