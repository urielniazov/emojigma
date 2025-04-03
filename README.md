# Emojigma 🎭🧩

A daily word puzzle game where players decode phrases represented by emojis.
[Play here](https://emojigma.vercel.app/)

## About the Game

Emojigma challenges players to decode the meaning behind 5 carefully chosen emojis. Each day presents a new puzzle with hints and feedback to guide players to the solution. The game combines wordplay, visual thinking, and pop culture knowledge in a fun, bite-sized daily challenge.

## Features

- 🧩 **Daily Challenges**: A new puzzle every day
- 🔍 **Smart Feedback**: Get hints on how close your guesses are
- 🏆 **Streak Tracking**: Build and maintain your solving streak
- 📱 **Mobile-First Design**: Play seamlessly on any device
- 🔄 **Share Results**: Challenge friends with your solving stats

## Tech Stack

- **Frontend**: Vite + React with modern Hooks and Context API
- **Styling**: Tailwind CSS for responsive design
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Context
- **Deployment**: Vercel

### Prerequisites

- Node.js (v16+)
- npm or yarn

## Database Setup

### Supabase Configuration

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Set up the following tables:

**Puzzles**
```sql
CREATE TABLE puzzles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  emojis TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  used BOOLEAN DEFAULT false,
  used_date DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**User Attemps**
```sql
CREATE TABLE user_puzzle_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id TEXT,
  puzzle_id UUID REFERENCES puzzles(id) ON DELETE CASCADE,
  date DATE,
  completed BOOLEAN DEFAULT false,
  attempts_count INT4 DEFAULT 0,
  attempts_data JSONB,
  time_to_solve INT4,
  shared BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

**Feedbacks**
```sql
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  device_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

3. Create a `.env` file with your Supabase details:
   ```
   REACT_APP_SUPABASE_URL=your-supabase-url
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

## Game Logic

- Each day presents a new, randomly selected unused puzzle
- Players get 6 attempts to guess the correct answer
- Feedback is provided for each guess:
  - ✅ Correct: The answer matches exactly
  - 🔄 Partially correct: Some elements of the answer are right
  - ❌ Incorrect: The answer is wrong
- Optional hints are available if players are stuck
- Game progress is saved to continue across sessions

## Todo List
- [x] Complete frontend
- [x] Work on backend
- [x] Create Supabase project
- [x] Publish the game
- [x] Post on LinkedIn
- [x] Create leaderboard
- [x] Create how to & feedback
- [ ] Implement Google auth via [supabase](https://medium.com/@hasnainsayyed833/implement-google-authentication-in-react-js-using-supabase-7cf9f397f778)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all the word puzzle games that inspired this project
- Emoji designs that make this game possible
- The React team for building an amazing framework

---

Developed with ❤️ by Uriel Niazov