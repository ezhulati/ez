# Contentful Blog Integration

This project integrates with Contentful CMS to provide a blog section with both published and preview content capabilities.

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in your Contentful credentials
4. Run the development server: `npm run dev`

## Contentful Configuration

### Required Environment Variables

- `VITE_CONTENTFUL_SPACE_ID`: Your Contentful space ID
- `VITE_CONTENTFUL_ACCESS_TOKEN`: Content Delivery API token for published content
- `VITE_CONTENTFUL_PREVIEW_TOKEN`: Content Preview API token for draft content
- `VITE_CONTENTFUL_ENVIRONMENT`: Contentful environment (defaults to "master")

### Content Models

The blog integration expects the following content models in Contentful:

#### Blog Post

- `title`: Text
- `slug`: Text (unique)
- `featuredImage`: Media (image)
- `excerpt`: Text
- `content`: Markdown/Text
- `categories`: Array of Text
- `author`: Reference to Author
- `publishedDate`: Date

#### Author

- `name`: Text
- `avatar`: Media (image)

## Preview Mode

The application supports Contentful preview mode, allowing you to view draft content before publication:

- Toggle preview mode using the button in the bottom left corner of blog pages
- Create preview links by appending `?preview=true` to any blog post URL
- Preview mode is stored in localStorage and persists between sessions until toggled off

## Automated Sitemap Generation

The site automatically generates a `sitemap.xml` file during the build process. This sitemap includes:

- Static pages
- Blog posts (fetched from Contentful API)
- Tool pages

When you publish new content in Contentful, a webhook triggers a new Netlify build, which automatically updates the sitemap.

### Sitemap Scripts

- `npm run generate-sitemap` - Generate the sitemap manually
- `CONTENTFUL_MANAGEMENT_TOKEN=your_token node scripts/setup-contentful-webhook.js` - Set up the Contentful webhook

The sitemap is automatically generated during each build and placed in both the `public/` and `dist/` directories.

## Netlify Integration

This project includes a Netlify configuration file with webhook support for automatic deployments when content is published in Contentful.

To set up the webhook:

1. Deploy the site to Netlify
2. Get the build hook URL from Netlify (already configured in `netlify.toml` as `CONTENTFUL_REBUILD_HOOK`)
3. Run the webhook setup script:
   ```
   CONTENTFUL_MANAGEMENT_TOKEN=your_token node scripts/setup-contentful-webhook.js
   ```
   
This will create a webhook in Contentful that triggers a Netlify build whenever content is published or unpublished.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
