# Finance Dashboard - Frontend Assignment

Hi Thanks for taking the time to review my submission for the Frontend Developer Intern role.

I built this using **Next.js** and **React**. To show my skills in pure CSS, I chose not to use UI libraries like Tailwind or MUI. Instead, I built the entire dashboard and its frosted glass design from scratch using basic CSS Modules and variables.

## Running the app

```bash
npm install
npm run dev
```
Then just open `http://localhost:3000` in your browser.

## How I built it

* **State Management:** I kept it simple. Instead of using complex tools like Redux, I used React Context to manage the transactions, filters, and theme. I also saved everything to `localStorage` so you don't lose your data when you refresh the page.
* **Data Handling:** I avoided saving calculated totals directly in the app's state to prevent bugs. Instead, I wrote helper functions to calculate chart totals and spending patterns on the fly.
* **User Roles:** I added a dropdown in the top right corner to let you switch between Admin and Viewer. Viewers can only see the data, while Admins can add and manage transactions.
* **Design & Animations:** The app fully supports Dark Mode to be easy on the eyes! I also added smooth, custom animations to the charts and cards to make the dashboard feel lively and interactive.

## Features included

* **Interactive Cards:** 
  * Hover over the dashboard cards to see a smooth, automatic rotating animation!
  * Click on any card to see it elegantly zoom right into the center of your screen. (Try hovering over multiple cards to see them queue up one by one!)
* **Light & Dark Mode:** Easily switch between light and dark themes using the sun/moon button in the header.
* **Export Data:** Click the simple "Export Data" button above the transaction table to download all your information as a CSV or JSON file.
* **Dashboard:** Four summary cards, a balance trend chart, and an animated donut chart for your spending categories.
* **Transactions:** A data table with text search, dropdown filtering, and sorting out of the box.
* **Insights:** A dedicated page showing your savings rate, biggest expenses, and monthly spending changes.
* **Extras:** A fully mobile-responsive layout and clear, helpful screens when there is no data to show.

Thanks again for looking over my work! I'd be happy to answer any questions you have about the code.
