# Emojigma 🎭🧩

A daily word puzzle game where players decode phrases, movie titles, or common expressions represented by 5 emojis.

## About the Game

Emojigma challenges players to decode the meaning behind 5 carefully chosen emojis. Each day presents a new puzzle with hints and feedback to guide players to the solution. The game combines wordplay, visual thinking, and pop culture knowledge in a fun, bite-sized daily challenge.

## Features

- 🧩 **Daily Challenges**: A new puzzle every day
- 🔍 **Smart Feedback**: Get hints on how close your guesses are
- 🏆 **Streak Tracking**: Build and maintain your solving streak
- 📱 **Mobile-First Design**: Play seamlessly on any device
- 🔄 **Share Results**: Challenge friends with your solving stats

## Tech Stack

- **Frontend**: React with modern Hooks and Context API
- **Styling**: Tailwind CSS for responsive design
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Context
- **Deployment**: [Your deployment platform]

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Getting Started

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the app

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

**UserProgress**
```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id TEXT NOT NULL,
  puzzle_id UUID REFERENCES puzzles(id),
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  attempts INTEGER DEFAULT 0,
  attempts_list JSONB,
  hints_used BOOLEAN DEFAULT false,
  last_played TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(device_id, puzzle_id, date)
);
```

**Analytics**
```sql
CREATE TABLE analytics (
  date DATE PRIMARY KEY,
  puzzle_id UUID REFERENCES puzzles(id),
  daily_active_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  total_plays INTEGER DEFAULT 0,
  completion_rate NUMERIC DEFAULT 0,
  avg_attempts NUMERIC DEFAULT 0
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

- [ ] Work on backend
- [ ] Create Supabase project
- [ ] Publish the game
- [ ] Post on LinkedIn

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all the word puzzle games that inspired this project
- Emoji designs that make this game possible
- The React team for building an amazing framework

---

Developed with ❤️ by Uriel Niazov