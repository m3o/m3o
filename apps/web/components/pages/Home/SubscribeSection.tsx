import type { FC } from 'react'

export const SubscribeSection: FC = () => {
  return (
    <section className="bg-white dark:bg-zinc-800">
      <div className="m3o-container sm py-36 text-left">
        <h4 className="font-bold text-4xl text-white">
          Subscribe to the latest updates
        </h4>
        <form
          action="https://micro.us8.list-manage.com/subscribe/post?u=f2a5263ff3a56a297fa473628&amp;id=e8d0dec6a3"
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          className="validate mt-8 max-w-3xl"
          target="_blank"
          noValidate>
          <div id="mc_embed_signup_scroll" className="md:flex md:items-center">
            <input
              type="email"
              name="EMAIL"
              className="input mr-4"
              id="mce-EMAIL"
              placeholder="Email address"
              required={true}
            />
            <div
              style={{ position: 'absolute', left: '-5000px' }}
              aria-hidden="true">
              <input
                type="text"
                name="b_f2a5263ff3a56a297fa473628_e8d0dec6a3"
                tabIndex={-1}
              />
            </div>
            <button
              type="submit"
              name="subscribe"
              id="mc-embedded-subscribe"
              className="btn w-full mt-4 md:mt-0 md:w-40 inverse-btn">
              Subscribe
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
