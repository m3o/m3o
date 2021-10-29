type BlogPost = {
  id: string;
  title: string;
  content: string;
  creator: string;
};

type BlogPostsResponse = {
  records?: [];
};

type PostsResponse = {
  posts: BlogPost[];
};

type CreateBlogPostFields = Omit<BlogPost, 'creator'>;
