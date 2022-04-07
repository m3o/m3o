import type {NextPage} from 'next'
import type {ServiceExamples} from '@/types'
import Link from 'next/link'
import {NextSeo} from 'next-seo'
import {SchemaObject} from 'openapi3-ts'
import {MainLayout} from '@/components/layouts'
import {Example, Section} from '@/components/pages/GettingStarted'
import {Routes} from '@/lib/constants'
import {withAuth, WithAuthProps} from '@/lib/api/m3o/withAuth'
import {fetchSingleService} from '@/lib/api/m3o/services/explore'
import seo from '@/lib/seo.json'
import {PageHeader} from '@/components/ui'

interface Props extends WithAuthProps {
  examples: ServiceExamples
  requestSchema: SchemaObject
}

export const getServerSideProps = withAuth(async context => {
  const {examples, schemas} = await fetchSingleService('helloworld')

  return {
    props: {
      examples,
      user: context.req.user,
      requestSchema: schemas[Object.keys(schemas)[0]],
    },
  }
})

const GettingStarted: NextPage<Props> = ({user, examples, requestSchema}) => {
  return (
    <MainLayout>
      <NextSeo
        title={seo.gettingStarted.title}
        description={seo.gettingStarted.description}
        canonical="https://m3o.com/getting-started"
      />
      <PageHeader
        title="Getting Started"
        subTitle="Welcome to M3O! Follow this guide to get started."
      />
      <div className="bg-zinc-50 dark:bg-zinc-900">
        <Section title="Sign Up">
          <p>
            <Link href={Routes.SignUp}>
              <a className="dark:text-blue-300">Sign up</a>
            </Link>{' '}
            or{' '}
            <Link href={Routes.Login}>
              <a className="dark:text-blue-300">log in</a>
            </Link>{' '}
            to M3O so you can get a token. You can use password based log in or
            oauth.
          </p>
          <p className="mt-2 italic">
            Note: For security purposes, if you log in with oauth, the password
            is no longer valid unless you reset it.
          </p>
        </Section>
        <Section title="Try out Hello world!">
          <p className="mb-6">
            Here&apos;s a simple example to call the helloworld API:
          </p>
          <div className="max-w-3xl">
            <Example examples={examples} requestSchema={requestSchema}/>
          </div>
        </Section>
        <Section title="Discover APIs">
          <p>
            Browse all of our public APIs on the{' '}
            <Link href={Routes.Explore}>
              <a className="dark:text-blue-300">Explore page</a>
            </Link>
            .
          </p>
        </Section>
        <Section title="Generate an API token">
          <p className="max-w-5xl">
            To create a new access token, visit{' '}
            <Link href={Routes.UserKeys}>
              <a className="dark:text-blue-300">API settings page</a>
            </Link>
            . You can specify which APIs the token can call or leave scopes
            blank to create a token that has access to all the APIs.
          </p>
        </Section>
        <Section title="Using an API">
          <p className="mt-4 mb-4">
            M3O APIs can be accessed via the url
            &#34;https://api.m3o.com/v1/[service]/[endpoint] &#34;. All API
            calls require an API token to be provided. You can specify the token in one of three ways:
            <ul className="list-disc mt-2">
              <li>via the &#34;Authorization&#34; header. Prepend your API token with the string &#34;Bearer&#34;
                i.e. the header will look like &#34;Authorization: Bearer &lt;YOUR API TOKEN&gt;&#34;</li>
              <li>via HTTP basic authentication. Use the string &#34;user&#34; as the username and use your API token as
                the password
              </li>
              <li>via the &#34;Sec-Websocket-Protocol&#34; header for websocket calls. Pass your API token as the
                protocol name
              </li>
            </ul>
          </p>

          <p className="mt-4">
            Our APIs provide a JSON based request/response format and also require a `Content-Type: application/json`
            header for each request.
          </p>

          <p className="mt-4">
            After familiarising yourself with an API by reading the API
            reference (e.g{' '}
            <Link href="/db/api#Read">
              <a className="dark:text-blue-300">https://m3o.com/db/api#Read</a>
            </Link>
            ) you probably want to start calling the API. M3O APIs can be
            called via HTTP in any language or using our node.js and Golang
            specific clients.
          </p>
        </Section>
        <Section title="Download the CLI">
          <p>
            M3O includes a command line interface from which you can explore and
            query services. Go to{' '}
            <Link href="https://github.com/m3o/m3o-cli/releases/latest">
              <a className="dark:text-blue-300">https://github.com/m3o/m3o-cli/releases/latest</a>
            </Link>{' '}
            to download the latest release binary.
          </p>
        </Section>
        <Section title="Account Billing">
          <p>
            Each account has a credit based balance. Any request made
            to a an API will be debited from the balance in real time. When
            your balance is zero requests to APIs will return a blocked
            status.
          </p>
          <p className="mt-4">
            Additional API calls beyond the free quota are charged at 0.000001
            credit per request (aka £1 per 1 million requests). To check your balance
            and top-up your account head to the{' '}
            <Link href={user ? Routes.UserBilling : Routes.Login}>
              <a className="dark:text-blue-300">Billing page</a>
            </Link>
            .
          </p>
        </Section>
        <Section title="Fair Usage Policy">
          <p>
            Our free tier is rate limited to 10 requests per second. This can be
            unlocked by upgrading to the Pro subscription.
            We also invoke fair usage limits on compute and storage. During the
            beta period no hard limits are enforced, we will reach out if there
            are any issues.
          </p>
        </Section>
        <Section title="Feedback or Support">
          <p>
            Join the community and ask questions on <a className="dark:text-blue-300"
                                                       href="https://discord.gg/TBR9bRjd6Z">Discord</a>.
            If you&apos;re subscribed to the Pro tier email{' '}
            <a className="dark:text-blue-300" href="mailto:support@m3o.com">support@m3o.com</a> for help. Otherwise you
            can provide feedback at <a className="dark:text-blue-300" href="mailto:contact@m3o.com">contact@m3o.com</a>.
          </p>
        </Section>
      </div>
    </MainLayout>
  )
}

export default GettingStarted
