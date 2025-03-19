import Link from 'next/link';
import { getBlogPosts } from '../../src/lib/contentful';

export const metadata = {
  title: 'Blog | Enri Zhulati',
  description: 'Read the latest articles and insights on web development, SEO, and digital strategy.',
  openGraph: {
    title: 'Blog | Enri Zhulati',
    description: 'Read the latest articles and insights on web development, SEO, and digital strategy.',
    type: 'website',
    url: 'https://enrizhulati.com/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Enri Zhulati',
    description: 'Read the latest articles and insights on web development, SEO, and digital strategy.',
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Blog</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.length > 0 ? (
          posts.map((post) => {
            // Get image URL if available
            const imageUrl = post.fields.featuredImage?.fields?.file?.url 
              ? `https:${post.fields.featuredImage.fields.file.url}?fm=webp&w=600&h=400&fit=fill` 
              : post.fields.image?.fields?.file?.url 
                ? `https:${post.fields.image.fields.file.url}?fm=webp&w=600&h=400&fit=fill` 
                : 'https://via.placeholder.com/600x400?text=No+Image';
                
            // Get post URL - prefer customUrl if available
            const postSlug = post.fields.customUrl || post.fields.slug || post.sys.id;
            
            // Format date if available
            const publishDate = post.fields.publishedDate || post.sys.createdAt;
            const formattedDate = publishDate ? new Date(publishDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : '';
            
            return (
              <Link 
                href={`/blog/${postSlug}`} 
                key={post.sys.id}
                className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <img 
                  src={imageUrl} 
                  alt={post.fields.title} 
                  className="w-full h-48 object-cover" 
                />
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2 line-clamp-2">{post.fields.title}</h2>
                  {post.fields.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.fields.excerpt}</p>
                  )}
                  {formattedDate && (
                    <p className="text-sm text-gray-500">{formattedDate}</p>
                  )}
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-lg text-gray-600">No blog posts found. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
} 