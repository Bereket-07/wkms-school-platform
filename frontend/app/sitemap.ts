import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // Base URL
  const baseUrl = 'https://wakerokelborofoundation.org';

  // Core static routes
  const routes = [
    '',
    '/pledge',
    '/donate',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // If you ever add dynamic campaign pages (e.g., /campaigns/[id]), 
  // you would fetch them here and map over them to push to the routes array.
  // Example:
  // const campaigns = await getCampaigns();
  // const campaignRoutes = campaigns.map(c => ({
  //   url: `${baseUrl}/campaigns/${c.slug}`,
  //   lastModified: c.updated_at,
  //   changeFrequency: 'daily' as const,
  //   priority: 0.9,
  // }));
  // return [...routes, ...campaignRoutes];

  return routes;
}
