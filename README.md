# 🎓 MFStxCal

**A full-stack production-ready Next.js app with authentication, investment dashboard, MFSIP/Lumpsum tracking, and MongoDB integration for seamless mutual fund and stock portfolio management.**

## 🚀 Tech Stack

🚀 Next.js: React framework for server-side rendering and building web applications.

🍃 MongoDB: NoSQL database for data storage.

🔐 NextAuth: Authentication library for Next.js applications.

📏 Zod: TypeScript-first schema declaration and validation library.

## Available Scripts

In the project directory, you can run:

### `npm run serve`

Runs the app in the development mode.
Open [http://localhost:4000](http://localhost:3000) to view it in the browser.

### `next build`

Builds the app for production to the `.next` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

## [Live Site (Vercel)](https://mf-stx-cal.vercel.app/)

# Dependencies

### React Icons - https://www.npmjs.com/package/react-icons
    npm i react-icons

### Zod - https://www.npmjs.com/package/zod
    npm i zod

### Mongoose - https://www.npmjs.com/package/mongoose
    npm i mongoose

### Axios - https://www.npmjs.com/package/axios
    npm i axios

### Shadcn UI - https://ui.shadcn.com/docs/installation/next

### UseHooks - https://usehooks-ts.com/introduction
    npm i usehooks-ts

### React Toastify - https://www.npmjs.com/package/react-toastify
    npm i react-toastify

### Axios - https://www.npmjs.com/package/axios
    npm i axios

### Nuqs - https://www.npmjs.com/package/nuqs
    npm i nuqs

### Framer Motion - https://www.npmjs.com/package/framer-motion
    npm i framer-motion

### React Select - https://www.npmjs.com/package/react-select
    npm i react-select




### Not yet done
1. APIs to getAllMfLumpsums, updateMfLumpsum, deleteMfLumpsum
2. List of all mfLumpsums
3. Update  Mf Lumpsum functionality: Need to create route - /edit-investment/mutual-fund/lumpsum/{mfLumpsumExternalId}
4. Update, Delete MFFunds
5. Make Cancel button functional in MFSIPForm

### TODOs
1. Remove Apple SignIn
2. No. of Installments (Optional Field in MFSIP schema)
3. Sort ListView by dayOfMonth
4. loader.tsx
