import { serviceCategories } from '@/data/serviceCategories';

export default function sitemap() {
  const baseUrl = 'https://fix-acum.ro';

  const servicePages = serviceCategories.flatMap(category => [
    {
      url: `${baseUrl}/servicii/${category.id}`,
      lastModified: new Date(),
    },
    ...category.subcategories.map(subcat => ({
      url: `${baseUrl}/servicii/${category.id}/${subcat.id}`,
      lastModified: new Date(),
    }))
  ]);

  return [
    {
      url: `${baseUrl}/servicii`,
      lastModified: new Date(),
    },
    ...servicePages,
  ];
}