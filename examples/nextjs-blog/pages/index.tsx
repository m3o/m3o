import {NextPage, GetServerSideProps} from 'next';
import {UserSession} from '@m3o/m3o-node';
import Link from 'next/link';

type HomeProps = {
  user: UserSession;
  posts: BlogPost[];
};

const Home: NextPage<HomeProps> = ({posts}) => {
  return (
    <>
      <div className="h-screen bg-gray-50">
        <div className="container max-w-6xl mx-auto">
          <h1 className="font-extrabold text-2xl md:text-4xl py-8">
            Welcome To The Example Blog
          </h1>
          <p className="text-lg mb-6 text-gray-600">
            In this example we are making use of the{' '}
            <a
              href="https://m3o.com/user"
              className="text-indigo-400 underline font-bold"
            >
              User
            </a>{' '}
            and{' '}
            <a
              href="https://m3o.com/db"
              className="text-indigo-400 underline font-bold"
            >
              DB
            </a>{' '}
            api from Micro. Please see the readme for more details.
          </p>
          <div>
            {posts.map((post) => (
              <div
                className="p-8 bg-white rounded-md mb-6 shadow-sm"
                key={post.id}
              >
                <h2 className="font-bold text-2xl mb-4">
                  <Link href={`/blogs/${post.id}`}>
                    <a>{post.title}</a>
                  </Link>
                </h2>
                <p className="font-light">{post.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({req}) => {
  const response = await fetch('http://localhost:3000/api/blog');
  const {posts} = await response.json();

  return {
    props: {
      posts,
    },
  };
};

export default Home;
