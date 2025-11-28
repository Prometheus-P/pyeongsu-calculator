import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.href || 'https://pyeongsu-calculator.kr';

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${siteUrl}sitemap-index.xml
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
};
