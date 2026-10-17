# Me Online

## Project Structure

```
Me-online/
├── docs/                    Project documentation
│   ├── architecture/        Project structure, data model, architecture decisions
│   ├── design/              UI style guide, wireframes, user flows
│   ├── sprints/             Sprint plans and reports
│   └── user-testing/        Test plans, suppositions, results
├── frontend/                Web app
│   ├── public/              Static files served as-is
│   ├── src/
│   │   ├── assets/          Images, icons, fonts
│   │   ├── components/      Reusable UI components
│   │   ├── pages/           Screens
│   │   ├── hooks/           Custom React hooks
│   │   ├── services/        API and database calls
│   │   ├── lib/             Game rules and helper functions
│   │   ├── locales/         Chinese and English text
│   │   ├── styles/          Theme and global styles
│   │   └── types/           Shared TypeScript types
│   └── tests/               Frontend tests
├── backend/                 Server side
│   ├── supabase/
│   │   ├── migrations/      Database schema changes
│   │   └── functions/       Edge functions
│   └── tests/               Backend tests
└── data/                    Content data files loaded into the app
```
