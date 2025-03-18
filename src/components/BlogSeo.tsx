import { Helmet } from 'react-helmet-async';

interface BlogSeoProps {
  seoData: {
    title: string;
    description: string;
    keywords: string;
    canonicalUrl: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string | null;
    ogType: string;
    twitterCard: string;
    twitterTitle: string;
    twitterDescription: string;
    twitterImage: string | null;
    schemaType: string;
    publishDate: string;
    modifiedDate: string;
    authorName: string;
    excerpt: string;
  };
}

const BlogSeo = ({ seoData }: BlogSeoProps) => {
  if (!seoData) return null;
  
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

      {/* Twitter */}
      <meta name="twitter:card" content={seoData.twitterCard} />
      <meta name="twitter:title" content={seoData.twitterTitle} />
      <meta name="twitter:description" content={seoData.excerpt || seoData.twitterDescription || seoData.description} />
      {seoData.twitterImage && <meta name="twitter:image" content={seoData.twitterImage} />}

      {/* Schema.org / JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

export default BlogSeo; 