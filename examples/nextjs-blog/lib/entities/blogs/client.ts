import {get} from '../../fetch';

export async function fetchBlogsClient() {
  const {posts} = await get<PostsResponse>('blog');
  return posts;
}
