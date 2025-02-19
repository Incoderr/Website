import requests
from bs4 import BeautifulSoup
import json
import time
from typing import List, Dict


class AnimeParser:
    def __init__(self):
        self.base_url = "https://kinohost.web.app"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }

    def get_page(self, url: str) -> BeautifulSoup:
        """Получает и парсит страницу"""
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        return BeautifulSoup(response.text, 'html.parser')

    def get_anime_list(self, page: int = 1) -> List[Dict]:
        """Получает список аниме с указанной страницы"""
        url = f"{self.base_url}/anime/page/{page}"
        soup = self.get_page(url)

        anime_list = []
        anime_cards = soup.find_all('div', class_='anime-card')

        for card in anime_cards:
            anime_data = {
                'title': card.find('h2', class_='title').text.strip(),
                'url': self.base_url + card.find('a')['href'],
                'image': card.find('img')['src'],
                'rating': card.find('div', class_='rating').text.strip(),
                'year': card.find('div', class_='year').text.strip()
            }
            anime_list.append(anime_data)

        return anime_list

    def get_anime_details(self, url: str) -> Dict:
        """Получает детальную информацию об аниме"""
        soup = self.get_page(url)

        details = {
            'title': soup.find('h1', class_='anime-title').text.strip(),
            'description': soup.find('div', class_='description').text.strip(),
            'genres': [genre.text.strip() for genre in soup.find_all('span', class_='genre')],
            'episodes': soup.find('div', class_='episodes').text.strip(),
            'status': soup.find('div', class_='status').text.strip()
        }

        return details

    def collect_data(self, pages: int = 5) -> None:
        """Собирает данные с указанного количества страниц"""
        all_anime = []

        for page in range(1, pages + 1):
            print(f"Обработка страницы {page}...")
            anime_list = self.get_anime_list(page)

            for anime in anime_list:
                # Получаем детальную информацию
                details = self.get_anime_details(anime['url'])
                anime.update(details)
                all_anime.append(anime)

                # Делаем паузу между запросами
                time.sleep(2)

            # Сохраняем промежуточные результаты
            with open(f'anime_data_page_{page}.json', 'w', encoding='utf-8') as f:
                json.dump(all_anime, f, ensure_ascii=False, indent=2)

            print(f"Страница {page} обработана. Собрано: {len(all_anime)}")
            time.sleep(3)  # Пауза между страницами

        # Сохраняем финальный результат
        with open('anime_data_full.json', 'w', encoding='utf-8') as f:
            json.dump(all_anime, f, ensure_ascii=False, indent=2)

        print("Сбор данных завершен!")


# Пример использования
if __name__ == "__main__":
    parser = AnimeParser()
    parser.collect_data(pages=5)  # Собираем данные с 5 страниц