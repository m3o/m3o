import {GetServerSideProps} from 'next';
import {ReactElement} from 'react';

import {useForm} from 'react-hook-form';
import {Button} from '../../components/Button';
import {useCreateBlogPosts} from '../../lib/entities/blogs/useCreateBlogPost';
import {getUserFromServerRequestNextJs} from '../../m3o/user/helpers';

export default function Create(): ReactElement {
  const {register, handleSubmit} = useForm();
  const create = useCreateBlogPosts();

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <h1 className="mb-8 font-extrabold text-4xl">Create a new post</h1>
      <form onSubmit={handleSubmit(create)}>
        <div className="mb-6">
          <label htmlFor="email" className="block mb-2">
            Title
          </label>
          <input
            {...register('title')}
            type="text"
            className="w-full p-4 border border-solid border-gray-200"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="email" className="block mb-2">
            Content
          </label>
          <textarea
            {...register('content')}
            rows={10}
            className="w-full p-4 border border-solid border-gray-200"
          />
        </div>
        <div className="md:w-28">
          <Button type="submit">Create</Button>
        </div>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({req}) => {
  const user = await getUserFromServerRequestNextJs(req);

  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
