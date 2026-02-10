import { NextResponse } from 'next/server';

interface NewsArticle {
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: string;
}

async function fetchRSSFeed(query: string): Promise<NewsArticle[]> {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) return [];

    const xml = await response.text();

    const articles: NewsArticle[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let itemMatch;

    while ((itemMatch = itemRegex.exec(xml)) !== null) {
      const itemContent = itemMatch[1];

      const titleMatch = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]>|<title>(.*?)<\/title>/);
      const linkMatch = itemContent.match(/<link>(.*?)<\/link>/);
      const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/);
      const sourceMatch = itemContent.match(/<source[^>]*>(.*?)<\/source>/);
      const descriptionMatch = itemContent.match(
        /<description><!\[CDATA\[(.*?)\]\]>|<description>(.*?)<\/description>/
      );

      const title = titleMatch ? (titleMatch[1] || titleMatch[2] || '').trim() : '';
      const link = linkMatch ? linkMatch[1].trim() : '';
      const pubDate = pubDateMatch ? pubDateMatch[1].trim() : '';
      const source = sourceMatch ? sourceMatch[1].trim() : query;
      const description = descriptionMatch
        ? (descriptionMatch[1] || descriptionMatch[2] || '').replace(/<[^>]*>/g, '').trim()
        : '';

      if (title && link) {
        articles.push({
          title,
          url: link,
          publishedAt: pubDate || new Date().toISOString(),
          source,
          description: description || title,
        });
      }
    }

    return articles;
  } catch {
    return [];
  }
}

export async function GET() {
  const queries = [
    'Jonesboro GA',
    'Fulton County GA',
    'Henry County GA',
    'Fayette County GA',
  ];

  const results = await Promise.all(queries.map((query) => fetchRSSFeed(query)));
  const allArticles = results.flat();

  // Sort by date descending
  allArticles.sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime();
    const dateB = new Date(b.publishedAt).getTime();
    return dateB - dateA;
  });

  // Return top 20 articles
  const top20 = allArticles.slice(0, 20);

  return NextResponse.json(
    { articles: top20 },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600',
      },
    }
  );
}
