import {useRouter} from 'next/router';
import {useCallback} from 'react';
import {post} from '../../fetch';

export function useCreateBlogPosts() {
  const router = useRouter();

  const create = useCallback(
    async (values: CreateBlogPostFields) => {
      try {
        await post('blog', values);
        router.push('/');
      } catch (e) {
        console.log(e);
      }
    },
    [router],
  );

  return create;
}
