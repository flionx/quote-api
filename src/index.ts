import express, { Request, Response } from "express";
import cors from "cors";
import fetch from "node-fetch";
import * as fs from "fs";
import * as path from "path";

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

const app = express();
app.use(cors());

const isProduction = process.env.NODE_ENV === "production";
const QUOTE_FILE = isProduction
  ? "/tmp/daily_quote.json"
  : path.join(__dirname, "../tmp/daily_quote.json");

if (!isProduction) {
    const tmpDir = path.join(__dirname, "../tmp");
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir);
    }
}

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
        return { text: "There will be no tomorrow", author: "Unknown", date: new Date().toISOString().split("T")[0] };
    }
}

app.get("/api/quote", async (req: Request, res: Response): Promise<void> => {
    try {
        if (fs.existsSync(QUOTE_FILE)) {
            const fileData = fs.readFileSync(QUOTE_FILE, "utf-8");
            const savedQuote: IQuote = JSON.parse(fileData);

            if (savedQuote.date === new Date().toISOString().split("T")[0]) {
                res.json(savedQuote);
                return ;
            }
        }

        const newQuote = await fetchNewQuote();
        fs.writeFileSync(QUOTE_FILE, JSON.stringify(newQuote), "utf-8");
        res.json(newQuote);
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: error });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
export default app;