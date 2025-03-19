import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPost } from '../../../src/lib/contentful';

// Define the metadata type for the blog post page
type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Generate metadata for the blog post
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }
  
  // Prepare image URL if available
  const imageUrl = post.fields.featuredImage?.fields?.file?.url 
    ? `https:${post.fields.featuredImage.fields.file.url}?fm=webp&w=1200&h=630&fit=fill` 
    : post.fields.image?.fields?.file?.url 
      ? `https:${post.fields.image.fields.file.url}?fm=webp&w=1200&h=630&fit=fill` 
      : null;
  
  // Construct metadata object
  return {
    title: post.fields.metaTitle || post.fields.title,
    description: post.fields.metaDescription || post.fields.excerpt,
    keywords: post.fields.seoKeywords?.join(', ') || post.fields.categories?.join(', '),
    authors: post.fields.author?.fields?.name ? [{ name: post.fields.author.fields.name }] : undefined,
    openGraph: {
      title: post.fields.ogTitle || post.fields.metaTitle || post.fields.title,
      description: post.fields.ogDescription || post.fields.metaDescription || post.fields.excerpt,
      type: 'article',
      url: `https://enrizhulati.com/blog/${post.fields.customUrl || params.slug}`,
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.fields.featuredImage?.fields?.title || post.fields.title || 'Blog post image',
        }
      ] : undefined,
      publishedTime: post.fields.articlePublishDate || post.fields.publishedDate || post.sys.createdAt,
      modifiedTime: post.fields.articleModifiedDate || post.sys.updatedAt,
      authors: post.fields.author?.fields?.name ? [post.fields.author.fields.name] : undefined,
      tags: post.fields.seoKeywords || post.fields.categories,
    },
    twitter: {
      card: (post.fields.twitterCardType as 'summary' | 'summary_large_image' | 'app' | 'player') || 'summary_large_image',
      title: post.fields.ogTitle || post.fields.metaTitle || post.fields.title,
      description: post.fields.ogDescription || post.fields.metaDescription || post.fields.excerpt,
      images: imageUrl ? [imageUrl] : undefined,
      creator: '@enrizhulati',
      site: '@enrizhulati',
    },
    alternates: {
      canonical: post.fields.canonicalUrl || `https://enrizhulati.com/blog/${post.fields.customUrl || params.slug}`,
    },
  };
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
  // This would be implemented to pre-generate all blog posts at build time
  // For demonstration purposes, we're returning an empty array
  return [];
}

// Main blog post component
export default async function BlogPost({ params }: Props) {
  const post = await getBlogPost(params.slug);
  
  // If post doesn't exist, return 404
  if (!post) {
    notFound();
  }
  
  // Format date if available
  const publishDate = post.fields.publishedDate || post.sys.createdAt;
  const formattedDate = publishDate ? new Date(publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';
  
  // Get image URL if available
  const imageUrl = post.fields.featuredImage?.fields?.file?.url 
    ? `https:${post.fields.featuredImage.fields.file.url}?fm=webp&w=1200&h=600&fit=fill` 
    : post.fields.image?.fields?.file?.url 
      ? `https:${post.fields.image.fields.file.url}?fm=webp&w=1200&h=600&fit=fill` 
      : null;
  
  // Get author information if available
  const authorName = post.fields.author?.fields?.name || 'Enri Zhulati';
  const authorAvatar = post.fields.author?.fields?.avatar?.fields?.file?.url 
    ? `https:${post.fields.author.fields.avatar.fields.file.url}?fm=webp&w=100&h=100&fit=fill` 
    : null;
    
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Featured image */}
      {imageUrl && (
        <div className="mb-8">
          <img 
            src={imageUrl} 
            alt={post.fields.featuredImage?.fields?.title || post.fields.title} 
            className="w-full rounded-lg shadow-md" 
            width={1200}
            height={600}
          />
        </div>
      )}
      
      {/* Title and intro hook */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 leading-tight">
        {post.fields.title}
      </h1>
      
      {post.fields.introHook && (
        <p className="text-xl md:text-2xl mb-6 font-medium leading-relaxed">
          {post.fields.introHook}
        </p>
      )}
      
      {/* Author and date */}
      <div className="flex items-center mb-8">
        {authorAvatar ? (
          <img 
            src={authorAvatar} 
            alt={authorName} 
            className="w-10 h-10 rounded-full mr-3 border border-gray-200" 
            width={40}
            height={40}
          />
        ) : (
          <div className="w-10 h-10 rounded-full mr-3 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">👤</span>
          </div>
        )}
        <div>
          <p className="font-medium">{authorName}</p>
          {formattedDate && <p className="text-sm text-gray-600">{formattedDate}</p>}
        </div>
      </div>
      
      {/* Post content - In a real implementation, you would render the rich text content */}
      <div className="prose max-w-none">
        {post.fields.body ? (
          <div dangerouslySetInnerHTML={{ __html: post.fields.body }} />
        ) : (
          <p>This post has no content.</p>
        )}
      </div>
      
      {/* Tags/Categories */}
      {post.fields.categories && post.fields.categories.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {post.fields.categories.map((category) => (
              <span 
                key={category} 
                className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-800"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Author bio - In a full implementation, you would display the author's bio */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-bold mb-4">About the Author</h2>
        <div className="flex items-start">
          {authorAvatar ? (
            <img 
              src={authorAvatar} 
              alt={authorName}
              className="w-16 h-16 rounded-full mr-4 border border-gray-200" 
              width={64}
              height={64}
            />
          ) : (
            <div className="w-16 h-16 rounded-full mr-4 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">👤</span>
            </div>
          )}
          <div>
            <h3 className="font-bold text-lg">{authorName}</h3>
            <p className="text-gray-700">
              Enri Zhulati is a digital strategist and web developer passionate about helping businesses grow online.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
} 