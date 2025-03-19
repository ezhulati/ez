import BlogPostComponent from '../components/blog/BlogPost';
import PageTransition from '../components/PageTransition';
import { useParams } from 'react-router-dom';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  return (
    <PageTransition>
      <BlogPostComponent key={slug} />
    </PageTransition>
  );
};

export default BlogPostPage;