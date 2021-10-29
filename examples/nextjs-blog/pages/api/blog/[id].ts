import {NextApiRequest, NextApiResponse} from 'next';
import {postsDb} from '../../../lib/blog';

type Query = {
  id: string;
};

export const fetchBlogPost = (id: string) =>
  postsDb.read({table: 'posts', query: `id == "${id}"`});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const query = req.query as Query;

  if (req.method !== 'GET') {
    res.status(404).send({});
    return;
  }

  try {
    const response = await fetchBlogPost(query.id);
    const [post] = response.records || [];

    res.send({
      post,
    });
  } catch (e) {
    console.log(e);
  }
}
