module.exports = {
  siteUrl: 'https://www.fix-acum.ro',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ['/admin/*', '/login', '/signup', '/dashboard/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/login', '/signup', '/dashboard']
      }
    ]
  },
  transform: async (config, path) => {
    // Custom transformation for dynamic routes
    if (path.includes('/workers/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString()
      };
    }
    if (path.includes('/dashboard/job-details/')) {
      return null; // Exclude job details pages from sitemap
    }
    return {
      loc: path,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString()
    };
  },
};
