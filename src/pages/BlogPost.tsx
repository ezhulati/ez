import BlogPostComponent from '../components/blog/BlogPost';
import PageTransition from '../components/PageTransition';

const BlogPostPage = () => {
  return (
    <PageTransition>
      <BlogPostComponent />
    </PageTransition>
  );
};

export default BlogPostPage;