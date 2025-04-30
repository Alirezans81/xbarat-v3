# 💸 Fiat Currency Transfer & Exchange Platform

A Next.js-based platform for transferring and converting fiat currencies by connecting users directly to other users. The project is currently in development, focusing on the user-side functionality, with plans to introduce roles, admin panel, and enhanced authentication in future iterations.

## 🚀 Project Status

- ✅ User panel: In progress
- ❌ Admin panel: Not implemented yet
- ❌ Role-based access: Planned
- ⚠️ Authentication: Currently basic (password only), JWT planned

---

## 🧱 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, API Routes)
- **Database**: PostgreSQL (via [Prisma ORM](https://www.prisma.io/))
- **Styling**: Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (possible future switch to Redux)
- **Internationalization**: `next-intl`
- **Auth**: bcrypt (basic), JWT (future)
- **Forms**: Custom-controlled forms (no libraries)
- **Package Manager**: pnpm

---

## 📁 Folder Structure

```
src/
├── api/                   # Server routes and backend APIs
├── app/                   # App directory (App Router)
│   ├── back/api/v1/user/  # API versioning & user routes
│   │   ├── [id]/
│   │   ├── login/
│   │   └── route.ts
│   └── front/             # Frontend views and routes
│       ├── [locale]/      # For internationalization
│       ├── favicon.ico
│       └── globals.css
├── assets/                # Images and static assets
├── components/            # Reusable components
│   ├── dialog/
│   ├── navbar/
│   └── ui/
│       ├── app-sidebar.tsx
│       ├── footer.tsx
│       ├── locale-toggle.tsx
│       ├── navbar.tsx
│       └── theme-toggle.tsx
├── constants/             # Fixed arrays and values
├── fonts/                 # Fonts used in the app
├── generated/             # Prisma generated code
├── hooks/                 # Custom React hooks
```

---

## 🌍 Internationalization

- The app uses `next-intl` for localization.
- Messages are stored in `messages/*.json` files.
- URL structure is locale-based (`/[locale]/...`).
- Both frontend UI and backend messages support multiple languages.

---

## 🔒 Authentication & Authorization

- **Current**: Only password-based login
- **Planned**: JWT-based auth with token expiration
- **Roles**: Not implemented yet, but the user model will support a `role` field in the future to enable access control.

---

## ⚙️ Zustand Usage

Zustand is used for lightweight state management, including:

- User authentication state
- Modal visibility
- Form state

Redux may be considered later if application complexity increases.

---

## 📌 Future Roadmap

- [ ] Add Admin Panel
- [ ] Implement JWT Authentication
- [ ] Introduce role-based access
- [ ] Add full transaction history & messaging between users
- [ ] Payment gateway integration
- [ ] Advanced filtering and matching algorithms

---

## ❗ Notes

- All forms are custom-controlled for greater flexibility and performance.
- No form libraries have been used intentionally.
- There is currently no project documentation aside from this README.

---

## 🧑‍💻 Developer Notes

This project is versioned and modular, with future scalability in mind. The goal is to keep the structure clean and adaptable, while prioritizing user experience and security.

---

## 🚀 Getting Started

Follow these steps to get the project running locally:

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Setup environment variables**  
   Create a `.env` file based on `.env.example` and update the values:

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

4. **Setup the database**

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Run the development server**

   ```bash
   pnpm dev
   ```

6. **Open in browser**  
   Navigate to `http://localhost:3000`

---
