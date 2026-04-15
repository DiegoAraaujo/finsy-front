# 🚀 Fynsy

**Fynsy** was born to be your right-hand man in financial organization. We know that dealing with money can be stressful, so we created a platform focused on being simple, reliable, and consistent. Our goal is straightforward: to help people get their bills and finances in order with total clarity and security.

📱 **Mobile First & Responsive:** Fynsy was designed for mobile first. This means you get an amazing experience right in the palm of your hand, but it also adapts perfectly if you prefer using it on a computer.

## 🛠️ Tech Stack

* **React + TypeScript:** Project foundation using strict typing to prevent runtime errors.
* **Vite:** Next-generation build tool for an agile development cycle.
* **Tailwind CSS v4:** High-performance utility-first styling and visual consistency.
* **TanStack React Query:** Asynchronous state management focused on data synchronization and caching.
* **React Router Dom:** Robust navigation system between application modules.
* **Axios:** HTTP client for secure communication with the API.
* **Recharts:** Analytical data visualization through precise charts to track financial progress.
* **Sonner:** Elegant real-time toast notifications for user feedback.

---

## ⚙️ Initial Configuration

For the frontend to communicate correctly with the server, you must configure the environment variable:

1. In the project root folder, create a file named `.env`
2. Add the following line:

VITE_BASE_URL=http://localhost:3001

> **⚠️ Important:** The value of `VITE_BASE_URL` depends entirely on your **Backend** setup. Ensure the port (e.g., 3001) matches the one where your API is currently running, otherwise the connection will fail.

---

## 🚀 How to Run Locally

Follow these steps in your terminal:

1. **Install dependencies:**
   npm install

2. **Start the development server:**
   npm run dev

3. **Access the project:**
   The terminal will provide a link (usually http://localhost:5173). Simply copy and paste it into your browser.
