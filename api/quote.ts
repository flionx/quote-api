import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';
import * as fs from 'fs';

interface IQuote {
    text: string;
    author: string;
    date: string;
}

interface IData {
    quote: {
        body: string;
        author: string;
    };
}

const QUOTE_FILE = '/tmp/daily_quote.json';

async function fetchNewQuote(): Promise<IQuote> {
    try {
        const response = await fetch("https://favqs.com/api/qotd");
        if (!response.ok) throw new Error("Error while requesting quote");
        const data = (await response.json()) as IData;
        return {
            text: data.quote.body,
            author: data.quote.author,
            date: new Date().toISOString().split("T")[0], // '2025-03-10'
        };
    } catch (error) {
        console.error("Error while requesting quote: ", error);
        return { 
            text: "There will be no tomorrow", 
            author: "Unknown", 
            date: new Date().toISOString().split("T")[0] 
        };
    }
}

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
    try {        
        if (fs.existsSync(QUOTE_FILE)) {
            const fileData = fs.readFileSync(QUOTE_FILE, "utf-8");
            const savedQuote: IQuote = JSON.parse(fileData);
            const today = new Date().toISOString().split("T")[0];
            
            if (savedQuote.date === today) {
                res.json(savedQuote);
                return;
            }
        }
        const newQuote = await fetchNewQuote();
        fs.writeFileSync(QUOTE_FILE, JSON.stringify(newQuote), "utf-8");
        res.json(newQuote);
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: String(error) });
    }
};