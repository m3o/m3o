import type {NextApiRequest, NextApiResponse} from 'next';
import {postsDb} from '../../../lib/blog';
import {getUserFromServerRequestNextJs} from '../../../m3o/user/helpers';

function fetchBlogPosts() {
  return postsDb.read({table: 'posts'});
}

function createBlogPost(payload: BlogPost) {
  return postsDb.create({table: 'posts', record: payload});
}

async function createPost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await getUserFromServerRequestNextJs(req);

    if (!user) {
      res.status(403).send({});
      return;
    }

    await createBlogPost({
      ...req.body,
      creator: user.id,
    });

    // console.

    res.send({});
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

async function getPosts(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetchBlogPosts();

    res.send({
      posts: response.records || [],
    });
  } catch (e) {
    console.log(e);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    return createPost(req, res);
  }

  if (req.method === 'GET') {
    return getPosts(req, res);
  }

  res.status(404).send({});
}
