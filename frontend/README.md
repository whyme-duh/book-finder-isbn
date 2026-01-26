ISBN Book Search App 📚A full-stack web application that allows users to retrieve detailed book information by entering an ISBN. It utilizes a hybrid data fetching strategy—combining public APIs for structured metadata with web scraping to enrich the results with plot summaries.🚀 FeaturesISBN Validation: Automatically detects and validates ISBN-10 and ISBN-13 formats.Hybrid Data Source:Primary: Fetches Title, Author, Publisher, and Cover from the Open Library API.Enrichment: Scrapes Goodreads using BeautifulSoup to find book descriptions/blurbs when APIs fail to provide them.Responsive UI: Built with React and Tailwind CSS, fully optimized for mobile, tablet, and desktop.Search History: Keeps track of recently searched books locally.🛠️ Tech StackFrontend:React.jsTailwind CSSLucide React (Icons)Backend:Django (Python Framework)BeautifulSoup4 (Web Scraping)Requests (HTTP Client)⚙️ Setup Instructions1. Backend (Django)Clone the repository:git clone [https://github.com/yourusername/isbn-search-app.git](https://github.com/yourusername/isbn-search-app.git)
cd isbn-search-app/backend
Create and activate a virtual environment:# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
Install Python dependencies:pip install django requests beautifulsoup4
Run the server:python manage.py runserver
The backend API will be available at http://localhost:8000/api/lookup/<isbn>/.2. Frontend (React)Navigate to the frontend folder:cd ../frontend
Install dependencies:npm install
# or
yarn install
Start the development server:npm start
The app should now be running at http://localhost:3000.🔌 API ReferenceGet Book DetailsEndpoint:GET /api/lookup/<isbn>/Parameters:isbn (string): A valid 10 or 13 digit ISBN (e.g., 9780140328721).Response Example:{
  "title": "Fantastic Mr. Fox",
  "authors": ["Roald Dahl"],
  "publisher": "Puffin",
  "published_date": "1988",
  "page_count": 96,
  "cover_url": "[https://covers.openlibrary.org/b/id/12632203-L.jpg](https://covers.openlibrary.org/b/id/12632203-L.jpg)",
  "description": "Boggis is an enormously fat chicken farmer. Bunce is a duck-and-goose farmer..."
}
