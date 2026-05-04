import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as fs from 'fs';

interface IQuote {
  text: string;
  author: string;
  date: string;
}

interface IQuotePair {
  en: IQuote;
  ru: IQuote;
}

const CACHE_FILE = process.env.VERCEL ? '/tmp/daily_quote.json' : './daily_quote.json';

const FALLBACK_QUOTES = {
  en: { text: "There will be no tomorrow", author: "Unknown" },
  ru: { text: "Не будет никакого завтра", author: "Неизвестный" }
};

async function fetchEnglishQuote(): Promise<IQuote> {
  const response = await fetch("https://favqs.com/api/qotd");
  if (!response.ok) throw new Error("Failed to fetch English quote");
  const data = await response.json();
  return {
    text: data.quote.body,
    author: data.quote.author,
    date: new Date().toISOString().split('T')[0],
  };
}

async function fetchRussianQuote(): Promise<IQuote> {
  const response = await fetch("https://api.forismatic.com/api/1.0/?method=getQuote&lang=ru&format=json");
  if (!response.ok) throw new Error("Failed to fetch Russian quote");
  const data = await response.json();
  return {
    text: data.quoteText,
    author: data.quoteAuthor?.trim() || "Неизвестный",
    date: new Date().toISOString().split('T')[0],
  };
}

async function safeFetchQuote(
  fetcher: () => Promise<IQuote>,
  lang: 'en' | 'ru'
): Promise<IQuote> {
  try {
    return await fetcher();
  } catch (error) {
    console.error(`Failed to fetch ${lang} quote:`, error);
    const today = new Date().toISOString().split('T')[0];
    return {
      text: FALLBACK_QUOTES[lang].text,
      author: FALLBACK_QUOTES[lang].author,
      date: today,
    };
  }
}

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    if (fs.existsSync(CACHE_FILE)) {
      try {
        const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
        if (cached.en?.date === today && cached.ru?.date === today) {
          return res.json(cached);
        }
      } catch (cacheError) {
        console.error("Cache read error, will fetch fresh:", cacheError);
      }
    }

    const [en, ru] = await Promise.all([
      safeFetchQuote(fetchEnglishQuote, 'en'),
      safeFetchQuote(fetchRussianQuote, 'ru')
    ]);

    const quotes: IQuotePair = { en, ru };

    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(quotes));
    } catch (cacheError) {
      console.error("Failed to write cache:", cacheError);
    }

    res.json(quotes);
  } catch (error) {
    console.error("Critical error:", error);
    const today = new Date().toISOString().split('T')[0];

    res.status(200).json({
      en: {
        text: FALLBACK_QUOTES.en.text,
        author: FALLBACK_QUOTES.en.author,
        date: today,
      },
      ru: {
        text: FALLBACK_QUOTES.ru.text,
        author: FALLBACK_QUOTES.ru.author,
        date: today,
      },
    });
  }
};