import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import * as fs from "fs";

const app = express();
app.use(cors());

const QUOTE_FILE = "/tmp/daily_quote.json";

async function fetchNewQuote() {
    try {
        const response = await fetch("https://favqs.com/api/qotd");
        if (!response.ok) throw new Error("Ошибка при запросе цитаты");

        const data = await response.json();
        return {
            text: data.quote.body,
            author: data.quote.author,
            date: new Date().toISOString().split("T")[0], // Сегодняшняя дата
        };
    } catch (error) {
        console.error("Ошибка получения цитаты:", error);
        return { text: "There will be no tomorrow", author: "Unknown", date: new Date().toISOString().split("T")[0] };
    }
}

app.get("/api/quote", async (req, res) => {
    try {
        if (fs.existsSync(QUOTE_FILE)) {
            const fileData = fs.readFileSync(QUOTE_FILE, "utf-8");
            const savedQuote = JSON.parse(fileData);

            if (savedQuote.date === new Date().toISOString().split("T")[0]) {
                return res.json(savedQuote);
            }
        }

        const newQuote = await fetchNewQuote();
        fs.writeFileSync(QUOTE_FILE, JSON.stringify(newQuote), "utf-8");
        res.json(newQuote);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

export default app;
