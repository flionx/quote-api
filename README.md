# Quote API

API for getting the quote of the day. Developed for [Boost Clock](https://boost-clock.vercel.app/), to bypass CORS policy and provide quotes in JSON format.

##  Demo

[Live Preview](https://quote-otday.vercel.app/)

## Main Features

- **Fetch Quote of the Day**: API returns a random quote in JSON format.
- **Caching**: The quote is stored for the day to reduce the number of requests to the external API.
- **Easy to use**: Just send a GET request to `/api/quote`.

## How to get started

### 1. Clone the Repository

Open a terminal and run the command:

```bash
git clone https://github.com/flionx/quote-api.git
```

###  Project structure

```
qute-api/
├─── dist/ # Compiled files
├─── src/ # Source files
│ └─── index.ts # Server main file
├──── tmp/ # Temporary files (locally)
├─── package.json # Dependencies and scripts
├──── tsconfig.json # TypeScript configuration
├──── vercel.json # Vercel configuration
└─── README.md # Documentation
```

### 2. Create a New Repository on GitHub

Go to [GitHub](https://github.com) and create a new repository.

### 3. Transfer the Project to Your Repository

   ```bash
   #1. Navigate to the folder with the cloned project:
   cd qute-api

   #2Remove the link to the original repository:
   rm -rf .git

   #3. Initialize a new Git repository:
   git init

   #4. Add a remote repository (replace `your-username` and `your-репозиторий` with your credentials):
   git remote add origin https://github.com/your-username/your-repo.git

   #5. Add the files and make the first commit:
   git add .
   git commit -m "Move Qute API to my repository"

   #6. Push the changes to GitHub:
   git push -u origin main
   ```
---

### 4. Deploy to Vercel
1. Go to [Vercel](https://vercel.com) and log in via GitHub.
2. Click **New Project**.
3. Select your repository (`your-repo`).
4. Leave the default settings and click **Deploy**.
5. Once the deploy is complete, you will receive a link to your API (e.g., `https://example.vercel.app`).

## Example response

```
{
  "text": "Either you think, or else others have to think for you and take power from you, pervert and discipline your natural tastes, civilize and sterilize you.",
  "author": "F. Scott Fitzgerald",
  "date": "2025-03-10"
}
```

##  Acknowledgements

- [FavQs](https://favqs.com/) for providing the API for citations.
- [Vercel](https://vercel.com/) for providing a free hosting platform.

##  License

This project is distributed under the MIT license. See the [LICENSE](LICENSE) file for details.
