import requests
import json
import time
import os
from pymongo import MongoClient
from dotenv import load_dotenv
from urllib.parse import quote_plus

load_dotenv()

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
KINOPOSK_API_KEY = os.getenv("KINOPOSK_API_KEY")
IMDB_API_KEY = os.getenv("IMDB_API_KEY")
MONGO_URI = os.getenv("MONGO_URI")

# Ограничение на количество аниме для парсинга
MAX_ANIME_COUNT = int(os.getenv("MAX_ANIME_COUNT", 2))

client = MongoClient(MONGO_URI)
db = client.anime_database
collection = db.anime_data


def get_anilibria_data(title):
    time.sleep(1)
    url = f"https://api.anilibria.tv/v3/title/search?search={title}&limit=1"
    response = requests.get(url)
    json_data = response.json()
    if response.status_code == 200 and json_data and isinstance(json_data, list) and len(json_data) > 0:
        data = json_data[0]
        return {
            "title": data.get("names", {}).get("ru", "Unknown"),
            "description": data.get("description", {}).get("ru", "No description"),
            "genres": data.get("genres", []),
        }
    return None


def get_anilist_data(title):
    time.sleep(1)
    query = """
    query ($search: String) {
        Media(search: $search, type: ANIME) {
            title {
                romaji
                english
                native
            }
            coverImage {
                large
            }
            averageScore
        }
    }
    """
    variables = {"search": title}
    url = "https://graphql.anilist.co"
    response = requests.post(url, json={"query": query, "variables": variables})
    if response.status_code == 200:
        data = response.json().get("data", {}).get("Media")
        if data:
            return {
                "rating": data.get("averageScore", 0),
                "poster": data.get("coverImage", {}).get("large", "")
            }
    return None


def get_backdrop(title):
    time.sleep(1)
    url = f"https://api.themoviedb.org/3/search/tv?query={title}&api_key={TMDB_API_KEY}"
    response = requests.get(url)
    if response.status_code == 200 and response.json().get("results"):
        show_id = response.json()["results"][0]["id"]
        backdrop_url = f"https://api.themoviedb.org/3/tv/{show_id}/images?api_key={TMDB_API_KEY}"
        backdrop_response = requests.get(backdrop_url)
        if backdrop_response.status_code == 200 and backdrop_response.json().get("backdrops"):
            return "https://image.tmdb.org/t/p/original" + backdrop_response.json()["backdrops"][0]["file_path"]
    return None


def get_kinopoisk_id(title):
    time.sleep(1)
    url = f"https://api.kinopoisk.dev/v1.3/movie/search?page=1&limit=1&query={title}"
    headers = {"X-API-KEY": KINOPOSK_API_KEY}
    response = requests.get(url, headers=headers)
    if response.status_code == 200 and response.json().get("docs"):
        return response.json()["docs"][0].get("id")
    return None


def get_imdb_id(title):
    time.sleep(1)
    url = f"https://www.omdbapi.com/?t={title}&apikey={IMDB_API_KEY}"
    response = requests.get(url)
    if response.status_code == 200 and response.json().get("imdbID"):
        return response.json()["imdbID"]
    return None


def get_ids(title):
    return {
        "kinopoisk": get_kinopoisk_id(title),
        "imdb": get_imdb_id(title),
        "tmdb": None  # Уже получено в get_backdrop
    }


def get_categories(title):
    return {
        "new_releases": False,  # Логика определения
        "popular": False,  # Логика определения
        "trending": False,  # Логика определения
        "top_rated": False  # Логика определения
    }


def get_franchise(title):
    return "Naruto Franchise" if "Naruto" in title else None  # Примерная логика


def parse_anime(title):
    anilibria = get_anilibria_data(title)
    anilist = get_anilist_data(title)
    backdrop = get_backdrop(title)
    ids = get_ids(title)
    categories = get_categories(title)
    franchise = get_franchise(title)

    if anilibria and anilist:
        anime_data = {
            "title": anilibria["title"],
            "description": anilibria["description"],
            "genres": anilibria["genres"],
            "rating": anilist["rating"],
            "poster": anilist["poster"],
            "backdrop": backdrop,
            "ids": ids,
            "franchise": franchise,
            "categories": categories
        }
        collection.insert_one(anime_data)
        return anime_data
    return None


if __name__ == "__main__":
    anime_titles = ["Naruto", "One Piece", "Attack on Titan", "Demon Slayer", "Jujutsu Kaisen"]
    parsed_count = 0
    for title in anime_titles:
        if parsed_count >= MAX_ANIME_COUNT:
            print("Достигнут лимит парсинга.")
            break
        parsed_data = parse_anime(title)
        if parsed_data:
            print(json.dumps(parsed_data, indent=4, ensure_ascii=False))
            parsed_count += 1
