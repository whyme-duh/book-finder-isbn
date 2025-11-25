import requests
from bs4 import BeautifulSoup
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import re

def get_api_data(isbn):
  
    url = f"https://openlibrary.org/api/books?bibkeys=ISBN:{isbn}&jscmd=data&format=json"
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        key = f"ISBN:{isbn}"
        
        if key in data:
            book = data[key]
            return {
                "title": book.get("title"),
                "authors": [a["name"] for a in book.get("authors", [])],
                "publisher": book.get("publishers", [{"name": "Unknown"}])[0]["name"],
                "published_date": book.get("publish_date"),
                "page_count": book.get("number_of_pages"),
                "pagination":book.get("pagination"),
                "weight": book.get("weight"),
                "cover_url": book.get("cover", {}).get("large"),
                "identifiers": book.get("identifiers", {})
            }
    except Exception as e:
        print(f"API Error: {e}")
    return None


def scrape_rating(isbn):
    
    search_url = f"https://www.goodreads.com/search?q={isbn}"    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        response = requests.get(search_url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        rating = soup.select_one('.RatingStatistics__rating')
        list_rating = soup.select_one('[data-testid="ratingsCount"]')
        img = soup.select_one('.ResponsiveImage')
        
        if rating:
            rating = rating.get_text(separator="\n").strip()
            rating_count = list_rating.get_text().strip()
           
            return [f'{rating} ({rating_count})', img['src']]
    except Exception as e:
        print(f"Scraping Error: {e}")
        
    return "Description not available via scraping."


        
    return "Description not available via scraping."

@require_http_methods(["GET"])
def book_lookup(request, isbn):
    clean_isbn = re.sub(r'[^0-9X]', '', str(isbn)).upper()
    
    if len(clean_isbn) not in [10, 13]:
        return JsonResponse({"error": "Invalid ISBN format"}, status=400)

    book_data = get_api_data(clean_isbn)
    
    if not book_data:
        return JsonResponse({"error": "Book not found in API"}, status=404)

    rating = scrape_rating(clean_isbn)
    book_data["rating"] = rating[0]
    book_data["img"] = rating[1]
    print(book_data["rating"], book_data["img"])
    print(book_data)
    
    
    return JsonResponse(book_data)