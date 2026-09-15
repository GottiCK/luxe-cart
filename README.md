# LUXE CART

A full-stack fashion e-commerce site — clothes, shoes and slippers — built on the MERN stack
(MongoDB, Express, React, Node) for Ghana Cedis pricing, mobile money checkout, and WhatsApp
ordering.

This is **Phase 1 of 8**: project scaffolding. The backend boots and connects to MongoDB, and
the frontend is a fully responsive, styled site with working navigation and a working cart
(add/remove/adjust quantity, persisted in the browser). Product data, auth, checkout and the
admin dashboard are not wired up yet — see the roadmap below.

## Stack

- **Frontend:** React 18 + Vite, React Router, Tailwind CSS, react-hot-toast
- **Backend:** Node.js + Express (ES modules), Mongoose
- **Database:** MongoDB (local or Atlas)
- **Auth (upcoming):** JWT, httpOnly cookies
- **Images (upcoming):** Cloudinary
- **Payments (upcoming):** MTN MoMo, Telecel Cash, AirtelTigo Money, card — placeholder flow
  for now, no live payment gateway connected yet
- **WhatsApp:** wa.me deep links to +233 559920138

## Project structure

```
luxe-cart/
├── backend/
│   ├── config/db.js            MongoDB connection
│   ├── controllers/            (empty — added per phase)
│   ├── middleware/errorMiddleware.js
│   ├── models/                 (empty — added in Phase 2)
│   ├── routes/                 (empty — added per phase)
│   ├── utils/                  (empty — added per phase)
│   ├── .env.example
│   └── server.js
├── frontend/
│   ├── public/images/          drop real product/lifestyle photos here
│   └── src/
│       ├── components/layout/  Navbar, Footer, Layout
│       ├── components/ui/      ProductCard, PlaceholderImage, Stars
│       ├── context/CartContext.jsx
│       ├── data/sampleProducts.js   TEMPORARY sample data — removed in Phase 4
│       ├── pages/               Home, Shop, Cart, ComingSoon, NotFound
│       └── utils/whatsapp.js
└── package.json                 convenience scripts to run both servers together
```

## Setup

**Requirements:** Node.js 18+, npm, and either a local MongoDB install or a free
[MongoDB Atlas](https://www.mongodb.com/atlas) cluster.

1. Install dependencies for both apps:
   ```
   npm run install:all
   ```
2. Create your env files from the examples:
   ```
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
   Open `backend/.env` and set `MONGO_URI` to your local or Atlas connection string, and set
   `JWT_SECRET` to a long random string. Cloudinary keys can stay blank until the image-upload
   phase.
3. Run both servers together from the project root:
   ```
   npm run dev
   ```
   Or run them separately in two terminals: `npm run dev:backend` and `npm run dev:frontend`.
4. Open the site at **http://localhost:5173**. The API health check is at
   **http://localhost:5000/api/health** — it should return `{"success":true, ...}` once MongoDB
   is connected.

## Adding real images

Every image slot on the site is currently a labeled placeholder (dashed box with a caption
telling you what goes there and the recommended size) rather than a stock photo — a fashion
store needs its own product photography, not generic filler. Drop real photos into
`frontend/public/images/` and swap them into the relevant component (`PlaceholderImage` usage
in `Home.jsx`, `ProductCard.jsx`, etc.) as you get them; that swap is straightforward and we'll
do it together once the product-catalog phase wires images to real product records.

## Roadmap

- [x] **Phase 1 — Scaffolding:** backend boot + MongoDB connection, frontend build system,
      design system (colors/type), responsive Navbar/Footer, full Home page layout, working
      client-side cart
- [ ] **Phase 2 — Database models:** User, Product, Order, Review, Category schemas
- [ ] **Phase 3 — Auth:** customer signup/login, admin login, JWT + protected routes
- [ ] **Phase 4 — Product catalog:** Shop page wired to real MongoDB data, category pages
      (T-shirts/Shirts/Trousers/Jeans/Dresses/Shorts/Hoodies/Jackets, Sneakers/Casual/Sports/
      Formal shoes/Sandals, Casual/Slides/Fashion/Men's/Women's slippers), search, filters
      (category, size, color, price range, new arrivals, best sellers)
- [ ] **Phase 5 — Cart & checkout:** connect cart to real products, delivery fee logic,
      checkout form, order creation, payment method selection (MoMo/Telecel Cash/AirtelTigo/
      card placeholder)
- [ ] **Phase 6 — Orders:** order confirmation page, order number, status flow (Pending →
      Confirmed → Processing → Shipped → Delivered), customer order history
- [ ] **Phase 7 — Admin dashboard:** product CRUD + image upload (Cloudinary), stock
      management, order management, customer list, discounts, category management, sales
      stats
- [ ] **Phase 8 — WhatsApp ordering + polish:** "Order on WhatsApp" button on every product
      (pre-filled with name/size/color/qty/price), final responsive/animation pass, security
      hardening

## Notes on decisions made so far

- **Payments:** no live gateway is connected yet. When we reach checkout (Phase 5), orders will
  be created with a `paymentStatus: "pending confirmation"` and the customer's chosen method
  recorded, so you can confirm payment manually via MoMo/WhatsApp at first — swapping in a real
  gateway (e.g. Paystack, which supports Ghana MoMo) later is a contained change, not a rebuild.
- **Images:** Cloudinary is the plan for admin-uploaded product photos, added in Phase 7 using
  `multer.memoryStorage()` + Cloudinary's own `upload_stream` directly (not the
  `multer-storage-cloudinary` package, which is stuck on an old `cloudinary@1.x` peer dependency
  that conflicts with the current SDK). The `CLOUDINARY_*` variables are already in
  `backend/.env.example`, ready for then.
