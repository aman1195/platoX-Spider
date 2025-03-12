# PlatoX AI - DeckInsight

An AI-powered pitch deck analysis and investment insights platform that helps investors make data-driven decisions.

## Features

- Automated pitch deck analysis using OCR and AI
- Comprehensive investment reports with actionable insights
- Competitor benchmarking and market gap analysis
- Expert ratings across multiple dimensions
- Real-time progress tracking
- Secure file storage and sharing

## Tech Stack

- **Frontend:** React + Next.js
- **Styling:** Tailwind CSS + ShadCN
- **Backend:** Supabase (BaaS)
- **AI:** OpenAI API
- **Deployment:** Vercel

## Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/deckinsight-ai.git
cd deckinsight-ai
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/         # Reusable React components
├── config/            # Configuration files
├── lib/               # Utility functions and API clients
├── styles/           # Global styles and Tailwind config
└── types/            # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Supabase team for the backend infrastructure
- OpenAI team for the AI capabilities
- All contributors who help improve this project
