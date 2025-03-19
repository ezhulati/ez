import { Helmet } from 'react-helmet-async';

interface BlogSeoProps {
  seoData: {
    // Basic SEO (prioritizes seoTitle from Contentful)
    title: string;       // Uses seoTitle field, or falls back to standard title
    description: string; // Uses seoDescription field, or falls back to excerpt
    keywords: string;
    canonicalUrl: string;
    
    // Open Graph / Facebook
    ogTitle: string;        // Uses seoTitle or title
    ogDescription: string;  // Uses seoDescription or excerpt
    ogImage: string | null;
    ogType: string;
    
    // Twitter Card
    twitterCard: string;
    twitterTitle: string;        // Uses seoTitle or title
    twitterDescription: string;  // Uses seoDescription or excerpt
    twitterImage: string | null;
    
    // Schema.org data
    schemaType: string;
    publishDate: string;
    modifiedDate: string;
    authorName: string;
    
    // Content
    excerpt: string;
  };
}

const BlogSeo = ({ seoData }: Partial<BlogSeoProps>) => {
  // If no data is provided at all, render minimal SEO
  if (!seoData) {
    return (
      <Helmet>
        <title>Blog | Enri Zhulati</title>
        <meta name="description" content="Read the latest articles and insights." />
        <meta property="og:title" content="Blog | Enri Zhulati" />
        <meta property="og:description" content="Read the latest articles and insights." />
        <meta property="og:type" content="website" />
      </Helmet>
    );
  }
  
  // Generate structured data for Schema.org
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': seoData.schemaType,
    'headline': seoData.title,
    'description': seoData.description,
    'image': seoData.ogImage,
    'datePublished': seoData.publishDate,
    'dateModified': seoData.modifiedDate,
    'author': {
      '@type': 'Person',
      'name': seoData.authorName
    }
  };

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.excerpt || seoData.description} />
      <meta name="keywords" content={seoData.keywords} />
      <link rel="canonical" href={seoData.canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={seoData.ogType} />
      <meta property="og:title" content={seoData.ogTitle} />
      <meta property="og:description" content={seoData.excerpt || seoData.ogDescription || seoData.description} />
      {seoData.ogImage && <meta property="og:image" content={seoData.ogImage} />}
      <meta property="og:url" content={seoData.canonicalUrl} />
      <meta property="og:site_name" content="Enri Zhulati" />
      
      {/* Additional Open Graph tags for better sharing */}
      {seoData.ogImage && <meta property="og:image:width" content="1200" />}
      {seoData.ogImage && <meta property="og:image:height" content="630" />}
      <meta property="og:locale" content="en_US" />
      <meta property="article:published_time" content={seoData.publishDate} />
      <meta property="article:modified_time" content={seoData.modifiedDate} />
      <meta property="article:author" content={seoData.authorName} />
      {seoData.keywords && <meta property="article:tag" content={seoData.keywords} />}

      {/* Twitter */}
      <meta name="twitter:card" content={seoData.twitterCard} />
      <meta name="twitter:title" content={seoData.twitterTitle} />
      <meta name="twitter:description" content={seoData.excerpt || seoData.twitterDescription || seoData.description} />
      {seoData.twitterImage && <meta name="twitter:image" content={seoData.twitterImage} />}
      <meta name="twitter:site" content="@enrizhulati" />
      <meta name="twitter:creator" content="@enrizhulati" />

      {/* Schema.org / JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

export default BlogSeo; 