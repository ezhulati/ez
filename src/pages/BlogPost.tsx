import BlogPostComponent from '../components/blog/BlogPost';
import PageTransition from '../components/PageTransition';
import PreviewModeToggle from '../components/blog/PreviewModeToggle';

const BlogPostPage = () => {
  return (
    <PageTransition>
      <BlogPostComponent />
      
      {/* Preview Mode Toggle */}
      <PreviewModeToggle />
    </PageTransition>
  );
};

export default BlogPostPage;