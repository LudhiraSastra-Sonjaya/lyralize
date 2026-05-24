# ✶ Lyralize ✶

> An elegant, immersive web archive and administration dashboard for music bands and creative collectives. Built with a warm cream and deep royal blue aesthetic, featuring custom typography and smooth GSAP micro-animations.

---

## 📂 Project Structure

This is a decoupled application separating the frontend client and the backend REST API:

- **`/backend`**: Laravel 13 REST API powered by SQLite database.
- **`/frontend`**: React 19 + Vite 8 frontend powered by Tailwind CSS 4 and GSAP animations.

---

## 🛠️ Setup & Running the Project

### 1. Prerequisites
- **PHP 8.4+** (SQLite extensions enabled)
- **Composer 2+**
- **Node.js 18+** & **npm**

---

### 2. Backend Setup (Laravel)

1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install PHP dependencies (using PHP 8.4):
   ```bash
   composer install
   ```

3. Configure your Environment:
   * Copy the `.env.example` to `.env` (if not already done).
   * Generate the Application Key:
     ```bash
     php artisan key:generate
     ```

4. Database Setup (SQLite):
   * Create an empty SQLite database file:
     ```bash
     touch database/database.sqlite
     ```
   * Run the database migrations:
     ```bash
     php artisan migrate
     ```

5. Run the Local Development Server:
   ```bash
   php artisan serve
   ```
   The backend API will be available at **`http://127.0.0.1:8000`**.

---

### 3. Frontend Setup (React)

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Run the Development Server:
   ```bash
   npm run dev
   ```
   The frontend application will be running at **`http://localhost:5173`**.

---

## 🎨 Visual Design System

- **Primary Colors**:
  - Warm Cream Background: `#F0EBE0`
  - Deep Royal Blue Typography: `#0C1B4D`
  - High Contrast Accent Blue: `#1E3FA8`
- **Typography**:
  - Headings: `Drowner Free` (Custom gothic/metal-inspired font)
  - Body: `Space Mono` (Sleek monospaced digital layout)
- **Atmospheric Effects**:
  - Grain overlay noise background
  - Custom fluid mouse cursor

---

## 🔒 Control Room (Admin Dashboard)

Access the admin dashboard at:
```text
http://localhost:5173/admin
```

### Admin Sections:
1. **Dashboard Overview**: Quick stats of all records.
2. **Albums & Tracks**: Edit album titles, releases, covers, and tracks.
3. **Shows**: Schedule and update ticket URLs.
4. **Merch**: Manage products and shop links.
5. **Gallery**: Manage media assets.
6. **Messages**: View messages sent from the contact form.
7. **Band Profile**: General profile details.

---

## 🧹 Code Quality & Formatting

Both sides have linting and styling tools pre-configured:
- **Backend Linting**: Done via [Laravel Pint](https://laravel.com/docs/pint). Run `vendor/bin/pint` in `/backend` to auto-format.
- **Frontend Linting**: Done via ESLint. Run `npm run lint` in `/frontend` to check for issues.
