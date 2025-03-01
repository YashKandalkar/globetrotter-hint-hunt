
# Globetrotter Challenge

A full-stack web application where users get cryptic clues about a famous place and must guess which destination it refers to.

## Features

- Random travel destination clues
- Multiple choice answers
- Immediate feedback with fun facts
- Score tracking
- Challenge friends feature
- User profiles

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- Supabase for backend and authentication

## Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Copy `.env.local.example` to `.env.local` and add your Supabase credentials
4. Run the development server with `npm run dev`

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL commands in `supabase/setup.sql` in the Supabase SQL editor
3. Enable Email OTP authentication in Supabase Auth settings
4. Update your `.env.local` file with the Supabase URL and anon key

## Game Rules

1. You'll be presented with 1-2 clues about a famous destination
2. Select the correct destination from the multiple choice options
3. Get immediate feedback on your answer with a fun fact
4. Track your score and challenge friends to beat it!

## Challenge a Friend

1. Sign up with a username
2. Play a few rounds to establish your score
3. Click "Challenge a Friend" to generate a shareable link
4. Share the link with friends to see if they can beat your score!

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
