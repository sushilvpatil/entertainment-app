🎥 Entertainment App Frontend
This is the frontend of the Entertainment App — a responsive, user-personalized platform for browsing trending and recommended movies & TV shows, bookmarking favorites, and managing profiles.

Built using:

Next.js 13+ (App Router)

Tailwind CSS

React Hooks

TMDB API (for movie & TV content)

Custom Express.js backend for authentication and bookmarks

✨ Features
🧑‍💻 User Authentication
Login / Signup with JWT token

Secure route access (e.g., homepage, profile)

🔍 Search & Filter
Real-time client-side filtering

Search movies/TV shows by title

📌 Bookmarks
Toggle bookmark for any media

Saved bookmarks sync with backend

Status reflects across app (recommended, trending)

🧭 Navigation & Layout
Fully responsive Sidebar navigation

Active tab highlighting

Profile avatar and logout on Sidebar bottom

📱 Mobile-First Responsive Design
Adaptive layout for mobile, tablet, and desktop

Sidebar collapses to topbar on smaller devices

Grid adapts from 2-cols (mobile) to 5-cols (desktop)

🧾 Profile Management
View and update user profile (name, email, profile picture)

Change password

Profile image upload (via third-party API)

🧙 Movie & TV Info Pages
Detailed view with:

Title, synopsis, rating

Genre, release year, cast list

External links (website, IMDb)

🧩 Tech Stack
Layer	Technology
Framework	Next.js (App Router)
Styling	Tailwind CSS
Auth & API	Custom backend (Express + JWT)
Toasts	React-Toastify
UI Icons	React-Icons, Lucide, HeroIcons
Image Upload	EscuelaJS File Upload API
Data Provider	TMDB API


 Folder Structure

entertainment-app-frontend/
├── app/
│   ├── page.js                # Home page (trending, recommended)
│   ├── auth/                  # Login & Signup
│   ├── profile/               # User profile
│   ├── details/               # Movie/TV info page
│
├── commonComponents/
│   ├── Sidebar.js             # Navigation bar (responsive)
│   ├── RecommendedCard.js     # Vertical card layout
│   ├── TrendingSlider.js      # Horizontal scroll slider
│   ├── Bookmarks.js           # Bookmarked content grid
│
├── api/                       # Custom fetch utils (getRequest, postRequest)
├── styles/                    # Tailwind and global CSS


🚀 Getting Started
npm install



🌐 Setup Environment
Create a .env.local file with:
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com/api
NEXT_PUBLIC_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500

🏁 Run the Development Server

npm run dev

visit the app

http://localhost:3000


🔐 Authentication Flow
On login/signup, JWT token is stored in localStorage

Protected routes (Home, Profile, Bookmarks) are checked on load

Token is attached to all authorized fetch requests

🖼️ Image Upload
Profile image is uploaded to:

https://api.escuelajs.co/api/v1/files/upload


📱 Responsiveness
View	Layout Adjustments
Mobile	Sidebar shifts to top, 2-column grids, scrollable sliders
Tablet	3-column grids, compact navbar
Desktop	5-column grid, Sidebar visible on left


🙌 Contributions
We welcome feedback, issues, and pull requests!



