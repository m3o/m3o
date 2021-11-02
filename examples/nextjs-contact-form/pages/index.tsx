import type { NextPage } from 'next'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ContactFormFields } from '@lib/types'
import { sendContactDetails } from '@lib/contact'
import { EMAIL_REGEX } from '@lib/validation'

const Home: NextPage = () => {
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { handleSubmit, register, formState } = useForm<ContactFormFields>()

  async function onSubmit(values: ContactFormFields) {
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      await sendContactDetails(values)
      setSuccess(true)
    } catch (e) {
      setError(e as string)
    }

    setLoading(false)
  }

  return (
    <div className="bg-gray-800 min-h-screen">
      <section className="container px-4 md:px-6 mx-auto max-w-7xl relative bg-white pb-6">
        <header className="pb-6 pt-6">
          <h1 className="font-bold text-2xl md:text-4xl mb-6">
            Example M3O contact form
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Below is an example of how to integrate the{' '}
            <a href="https://m3o.com/email">M3O email service</a> into a quick
            and simple contact form.
          </p>
          <p className="text-lg text-gray-600">
            Please see the &apos;/api&apos; folder for more information on how
            to integrate.
          </p>
        </header>
        {success ? (
          <p>Success! Please check your email to see your email</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 max-w-xl">
            {error && (
              <p className="bg-red-50 m py-2 px-4 mb-4 text-red-700 rounded-md">
                {error}
              </p>
            )}
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 text-sm font-bold">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="p-4 border border-gray-300 w-full rounded-md"
                placeholder="Please provide your name"
                {...register('name', { required: 'Please provide your name' })}
              />
              {formState.errors.name?.message && (
                <p className="text-red-700 my-2">
                  {formState.errors.name?.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-sm font-bold">
                Email
              </label>
              <input
                type="text"
                id="email"
                className="p-4 border border-gray-300 w-full rounded-md"
                placeholder="Please provide your email address"
                {...register('email', {
                  required: 'Please provide your email',
                  pattern: {
                    value: EMAIL_REGEX,
                    message: 'Please provide a valid email',
                  },
                })}
              />
              {formState.errors.email?.message && (
                <p className="text-red-700 my-2">
                  {formState.errors.email?.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="message" className="block mb-2 text-sm font-bold">
                Message
              </label>
              <textarea
                cols={30}
                rows={10}
                className="p-4 border border-gray-300 w-full rounded-md"
                placeholder="Please provide your message"
                {...register('message', {
                  required: 'Please provide a message',
                })}></textarea>
              {formState.errors.message?.message && (
                <p className="text-red-700 my-2">
                  {formState.errors.message?.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="inline-block px-6 py-4 mt-6 bg-indigo-600 text-white font-medium rounded-md mb-6"
              disabled={loading}>
              {loading ? 'Loading...' : 'Submit'}
            </button>
          </form>
        )}
      </section>
    </div>
  )
}

export default Home
