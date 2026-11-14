# ArticleIQ

**See beyond the headline.**

ArticleIQ is an AI-powered media analysis tool that helps readers examine how a news article presents information. Submit article text or a public article URL to receive an explainable assessment of credibility signals, bias, emotional tone, evidence strength, claims, and alternative framing perspectives.

## Live application

- **Frontend:** https://article-iq.vercel.app
- **Backend health check:** https://articleiq-backend.onrender.com

## Features

- **Analyze by URL or text** — paste a public article URL or enter article text.
- **Credibility assessment** — an estimated score based on the article's sourcing and supporting information.
- **Bias and emotional-tone indicators** — scores that highlight framing and emotional language signals.
- **Evidence-strength assessment** — a qualitative estimate of how well the article supports its claims.
- **Neutral summary** — a concise, factual overview of the submitted article.
- **Claim breakdown** — extracted claims with supporting context, evidence type, and confidence estimates.
- **Perspective comparison** — hypothetical examples showing how the same topic could be framed differently. These are illustrative perspectives, not actual headlines or reporting from named publications.
- **Analysis dashboard** — visual score cards, meters, explanations, and recent analysis history.

> **Important:** ArticleIQ provides AI-generated assessments to support critical reading. Scores and confidence values are estimates, not verified facts or definitive judgments about an article or publisher. Always consult the original article and independent sources.

## Tech stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express
- Axios
- Cheerio
- OpenAI SDK configured to use OpenRouter

### AI
- OpenRouter API
- Model: `openai/gpt-4o-mini`

### Deployment
- Frontend: Vercel
- Backend: Render

## How it works

1. The user submits article text or a URL from the frontend.
2. The React application sends the request to the Express API.
3. For URL submissions, the backend fetches the page and extracts paragraph text.
4. The backend sends the extracted or supplied text to the AI analysis service through OpenRouter.
5. The API returns structured analysis data, which the frontend displays in the dashboard.

The analysis input is limited to 8,000 characters before it is sent to the model.

## Run locally

### Prerequisites

- Node.js and npm
- An [OpenRouter API key](https://openrouter.ai/)

### 1. Clone the repository

```bash
git clone https://github.com/debuggingAvishka/ArticleIQ.git
cd ArticleIQ
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
PORT=5001
```

Start the backend:

```bash
npm run dev
```

The backend runs at `http://localhost:5001`.

### 3. Configure the frontend

Open a second terminal from the repository root:

```bash
cd frontend
npm install
```

Create a `.env.local` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:5001
```

Start the frontend:

```bash
npm run dev
```

Vite will print the local frontend URL in the terminal (typically `http://localhost:5173`).

### 4. Build the frontend

From the `frontend` directory:

```bash
npm run build
```

## API

### `GET /`

Health check. Returns:

```text
Backend is running 🚀
```

### `POST /analyze`

Accepts either article text or a public article URL.

**Text request:**

```json
{
  "article": "Paste the article text here."
}
```

**URL request:**

```json
{
  "url": "https://example.com/news-article"
}
```

The endpoint returns structured analysis fields, including scores, leaning, evidence strength, a neutral summary, explanation points, claims, and hypothetical perspective comparisons.

## Project structure

```text
ArticleIQ/
├── backend/
│   ├── utils/
│   │   └── extractArticleFromURL.js
│   ├── aiService.js
│   ├── server.js
│   ├── package.json
│   └── .env                 # create locally; do not commit
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.local           # create locally; do not commit
└── README.md
```

## Security and configuration notes

- Keep `OPENROUTER_API_KEY` in the backend environment. Never expose it through frontend variables or commit it to Git.
- Set `VITE_API_URL` to the backend base URL for each frontend environment.
- The backend restricts browser origins through its CORS allowlist.
- URL extraction accepts HTTP/HTTPS URLs, blocks non-public IP destinations, disables redirects, applies a request timeout, and limits response size.
- Do not commit `.env` or `.env.local` files.

## Deployment

The production application is deployed separately:

- **Vercel:** deploy the `frontend` directory with `VITE_API_URL` set to `https://articleiq-backend.onrender.com`.
- **Render:** deploy the `backend` directory with build command `npm install`, start command `npm start`, and the `OPENROUTER_API_KEY` environment variable.

## Contributing

Suggestions and improvements are welcome. For substantial changes, open an issue first to discuss the proposed update.

---

Built to encourage more critical and informed reading of online media.
