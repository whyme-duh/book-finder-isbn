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
        
        if rating:
            rating = rating.get_text(separator="\n").strip()
            rating_count = list_rating.get_text().strip()
           
            return f'{rating} ({rating_count})'
            
        # # Fallback for older layouts
        # description_span = soup.select_one("div#description span")
        # if description_span:
        #     # If there's a "display:none" span (full text), use that, else use the visible one
        #     full_text_span = description_span.find_next_sibling("span", style="display:none")
        #     if full_text_span:
        #         return full_text_span.get_text(separator="\n").strip()
        #     return description_span.get_text(separator="\n").strip()

    except Exception as e:
        print(f"Scraping Error: {e}")
        
    return "Description not available via scraping."

# ---------------------------------------------------------
# 3. The Main View (Combines Both)
# ---------------------------------------------------------
@require_http_methods(["GET"])
def book_lookup(request, isbn):
# 1. Sanitize Input
    clean_isbn = re.sub(r'[^0-9X]', '', str(isbn)).upper()
    
    if len(clean_isbn) not in [10, 13]:
        return JsonResponse({"error": "Invalid ISBN format"}, status=400)

    # 2. Fetch Clean Data (API)
    book_data = get_api_data(clean_isbn)
    
    # 3. Handle "Not Found" case
    if not book_data:
        return JsonResponse({"error": "Book not found in API"}, status=404)

    # 4. Enrich with Scraping (The "Hybrid" part)
    # We only scrape for the description, as APIs usually lack this.
    print(f"Scraping description for {clean_isbn}...")
    rating = scrape_rating(clean_isbn)
    book_data["rating"] = rating
    
    # 5. Return JSON to React
    return JsonResponse(book_data)