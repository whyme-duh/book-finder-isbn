# ISBN Book Search App 📚

A full-stack web application designed to provide comprehensive book metadata by bridging the gap between public APIs and web scraping. The application allows users to instantly retrieve detailed book information—including cover images, publication details, and community ratings—simply by entering an ISBN.

## 🧠 Project Architecture: The Hybrid Approach

This project demonstrates a **"Enrichment Pattern"** to data fetching, solving the common problem where fast public APIs lack social proof (ratings) or specific details.

1. **Primary Data Layer (Open Library API):**
   The Django backend first queries the Open Library API to fetch the core structured metadata: Title, Author, Publisher, Publication Date, Page Count, and Cover Image. This ensures fast, reliable, and legal access to the foundational book data.

2. **Enrichment Layer (Web Scraper):**
   Simultaneously, the backend utilizes `BeautifulSoup4` to perform targeted scraping on **Goodreads**. It navigates to the book's profile to extract the **Book Rating**, **Number of Ratings** and **Book cover**, data points that are typically unavailable in free public APIs.

   Extracted book cover image from Goodreads as well, since some books in Open Library API did not include book cover.

3. **Unified Response:**
   These two distinct data sources are merged on the server side into a single, clean JSON object and delivered to the React frontend, providing the user with a holistic view of the book in a single request.

## 🛠️ Technology Stack

* **Frontend:** React.js, Tailwind CSS, Lucide React (Icons).
* **Backend:** Django (Python), BeautifulSoup4 (Scraping), Requests.
* **Infrastructure:** Docker, Docker Compose, Fly.io (Cloud Deployment).

## ✨ Key Features

* **Hybrid Data Aggregation:** Seamlessly combines API JSON responses with HTML-scraped content.
* **Smart ISBN Validation:** Automatically detects, cleans, and validates ISBN-10 and ISBN-13 formats before processing.
* **Robust Error Handling:** Distinguishes between network errors, invalid ISBNs, and "Book Not Found" scenarios with user-friendly feedback.
* **Responsive UI:** A mobile-first design that adapts the layout for phone, tablet, and desktop screens using Tailwind's utility classes.
* **CORS & Security:** Backend configured with `django-cors-headers` to securely communicate with the separate frontend deployment.

## Use of Gemini
* **README.MD:** Use Gemini to write this README.md with some edits like this use of gemini.
* **Fly.io:** Never used Fly.io, but used it through the help of Gemini and got to know about Fly CLI and deployed both backend and frontend from this CLI.
* **Responsive:** While making the web responsive, I used Gemini in some parts like finding the perfect scale for each devices.