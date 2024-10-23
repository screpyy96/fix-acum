/** @type {import('next-sitemap').IConfig} */
const { serviceCategories } = require('./src/data/serviceCategories');

module.exports = {
  siteUrl: process.env.SITE_URL || 'https://fix-acum.ro',
  generateRobotsTxt: true,
  transform: async (config, path) => {
    // Logica existentă pentru transformare

    if (path.includes('/servicii')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString()
      };
    }

    // Returnați configurația implicită pentru alte pagini
    return {
      loc: path,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString()
    };
  },
  additionalPaths: async (config) => {
    const result = [];
    
    // Adăugați paginile de servicii
    serviceCategories.forEach(category => {
      result.push({ loc: `/servicii/${category.id}` });
      category.subcategories.forEach(subcat => {
        result.push({ loc: `/servicii/${category.id}/${subcat.id}` });
      });
    });

    return result;
  },
};
