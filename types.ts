export interface IQuote {
    text: string,
    author: string,
    date: string,
}

export interface IData {
    quote: {
        body: string,
        author: string
    },
}