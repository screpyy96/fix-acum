// app/sitemap.js
import { serviceCategories } from '@/data/serviceCategories';
import citiesData from '@/data/cities.json';

export default async function sitemap() {
  const baseUrl = 'https://www.fix-acum.ro'; // Înlocuiți cu URL-ul real al site-ului dvs.

  // Pagina principală
  const routes = [{ url: baseUrl, lastModified: new Date() }];

  // Pagini de servicii
  serviceCategories.forEach(category => {
    routes.push({
      url: `${baseUrl}/servicii/${category.id}`,
      lastModified: new Date(),
    });

    category.subcategories.forEach(subcategory => {
      routes.push({
        url: `${baseUrl}/servicii/${category.id}/${subcategory.id}`,
        lastModified: new Date(),
      });

      citiesData.cities.forEach(city => {
        routes.push({
          url: `${baseUrl}/servicii/${category.id}/${subcategory.id}/${encodeURIComponent(city)}`,
          lastModified: new Date(),
        });
      });
    });
  });

  return routes;
}

