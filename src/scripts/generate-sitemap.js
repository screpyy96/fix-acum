require('dotenv').config();

const fs = require('fs');
const path = require('path');

// Funcție pentru generarea sitemap-ului
async function generateSitemap() {
  const staticPages = [
    '/',
    '/about',
    '/contact',
    '/servicii',
    '/terms',
    '/privacy',
  ];

  // Fetch workers
  const { data: workers, error: workersError } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'worker');

  if (workersError) {
    console.error('Error fetching workers:', workersError);
    return;
  }

  const workerPages = workers.map(worker => `/workers/${worker.id}`);

  // Fetch job categories
  const { data: categories, error: categoriesError } = await supabase
    .from('job_categories')
    .select('slug');

  if (categoriesError) {
    console.error('Error fetching job categories:', categoriesError);
    return;
  }

  const categoryPages = categories.map(category => `/services/${category.slug}`);

  const allPages = [...staticPages, ...workerPages, ...categoryPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
    .map(page => {
      return `
    <url>
      <loc>${`https://www.fix-acum.ro${page}`}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.7</priority>
    </url>
  `;
    })
    .join('')}
</urlset>
`;

  fs.writeFileSync(path.resolve('./public/sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully!');
}

generateSitemap().catch(console.error);
