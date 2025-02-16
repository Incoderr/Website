import aiohttp
import asyncio
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import logging


class AnimeParser:
    def __init__(self):
        self.session = None
        # API keys should be stored in environment variables or config file
        self.tmdb_api_key = "e547e17d4e91f3e62a571655cd1ccaff"
        self.delays = {
            "shikimori": 1,  # 1 second between requests
            "anilist": 1,
            "tmdb": 0.25,  # TMDB allows 4 requests per second
            "imdb": 1
        }
        self.last_request = {
            "shikimori": datetime.min,
            "anilist": datetime.min,
            "tmdb": datetime.min,
            "imdb": datetime.min
        }
        self.logger = logging.getLogger(__name__)

    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()

    async def _wait_for_rate_limit(self, source: str):
        """Implements rate limiting for different APIs"""
        elapsed = datetime.now() - self.last_request[source]
        if elapsed.total_seconds() < self.delays[source]:
            await asyncio.sleep(self.delays[source] - elapsed.total_seconds())
        self.last_request[source] = datetime.now()

    async def get_shikimori_data(self, anime_id: int) -> Dict:
        """Fetch anime data from Shikimori"""
        await self._wait_for_rate_limit("shikimori")
        url = f"https://shikimori.one/api/animes/{anime_id}"
        async with self.session.get(url) as response:
            if response.status == 200:
                data = await response.json()
                return {
                    "title_ru": data.get("russian"),
                    "title_en": data.get("name"),
                    "shikimori_id": data.get("id"),
                    "shikimori_rating": data.get("score"),
                    "kinopoisk_id": data.get("kinopoisk_id")
                }
            return {}

    async def get_tmdb_data(self, title: str) -> Dict:
        """Fetch anime data from TMDB"""
        await self._wait_for_rate_limit("tmdb")
        url = f"https://api.themoviedb.org/3/search/tv"
        params = {
            "api_key": self.tmdb_api_key,
            "query": title,
            "language": "ru-RU"
        }
        async with self.session.get(url, params=params) as response:
            if response.status == 200:
                data = await response.json()
                if data["results"]:
                    result = data["results"][0]
                    return {
                        "tmdb_id": result.get("id"),
                        "backdrop_path": f"https://image.tmdb.org/t/p/original{result.get('backdrop_path')}",
                        "poster_path": f"https://image.tmdb.org/t/p/original{result.get('poster_path')}",
                        "overview_ru": result.get("overview"),
                        "first_air_date": result.get("first_air_date"),
                        "status": result.get("status")
                    }
            return {}

    async def get_anime_data(self, anime_id: int) -> Dict:
        """Combine data from all sources"""
        shikimori_data = await self.get_shikimori_data(anime_id)
        if not shikimori_data:
            return {}

        tmdb_data = await self.get_tmdb_data(shikimori_data["title_en"])

        return {
            "id": anime_id,
            "titles": {
                "ru": shikimori_data.get("title_ru"),
                "en": shikimori_data.get("title_en")
            },
            "images": {
                "poster": tmdb_data.get("poster_path"),
                "backdrop": tmdb_data.get("backdrop_path")
            },
            "ratings": {
                "shikimori": shikimori_data.get("shikimori_rating"),
                "tmdb": tmdb_data.get("vote_average")
            },
            "dates": {
                "first_air_date": tmdb_data.get("first_air_date")
            },
            "status": tmdb_data.get("status"),
            "overview": tmdb_data.get("overview_ru"),
            "external_ids": {
                "shikimori": shikimori_data.get("shikimori_id"),
                "tmdb": tmdb_data.get("tmdb_id"),
                "kinopoisk": shikimori_data.get("kinopoisk_id")
            }
        }

    async def get_anime_collection(self, category: str, limit: int = 20) -> List[Dict]:
        """Get collection of anime based on category"""
        base_url = "https://shikimori.one/api/animes"
        params = {
            "limit": limit,
            "order": "popularity" if category == "popular" else "id",
            "status": "ongoing" if category == "airing" else None,
            "season": datetime.now().year if category == "current" else None
        }

        await self._wait_for_rate_limit("shikimori")
        async with self.session.get(base_url, params=params) as response:
            if response.status == 200:
                anime_list = await response.json()
                results = []
                for anime in anime_list:
                    data = await self.get_anime_data(anime["id"])
                    if data:
                        results.append(data)
                return results
            return []


async def main():
    async with AnimeParser() as parser:
        # Example usage
        popular_anime = await parser.get_anime_collection("popular", limit=10)
        print(json.dumps(popular_anime, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    asyncio.run(main())