import json
import re
import time
from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.firefox import GeckoDriverManager
from bs4 import BeautifulSoup


def get_anime_list(limit=100, delay=2):
    url = "https://m.imdb.com/search/title/?title_type=feature,tv_movie,tv_special,video,tv_series,tv_miniseries&interests=in0000027"

    # Настройки Chrome
    options = Options()
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    # Запуск браузера
    service = Service(GeckoDriverManager().install())
    driver = webdriver.Firefox(service=service, options=options)

    driver.get(url)
    anime_list = []  # Используем список вместо set()

    while len(anime_list) < limit:
        # Ждём загрузки страницы
        time.sleep(delay)
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))

        # Парсим HTML через BeautifulSoup
        soup = BeautifulSoup(driver.page_source, "html.parser")
        anime_items = soup.find_all("li", class_="ipc-metadata-list-summary-item")

        for item in anime_items:
            if len(anime_list) >= limit:
                break

            title_link = item.find("a", class_="ipc-title-link-wrapper")
            if not title_link:
                continue

            title_en = title_link.text.strip()
            title_url = "https://m.imdb.com" + title_link["href"]
            ttid_match = re.search(r"/title/(tt\d+)/", title_url)
            ttid = ttid_match.group(1) if ttid_match else ""

            # Русское название
            title_ru = ""
            alt_title_tag = item.find("div", class_="sc-73d0305e-2")
            if alt_title_tag:
                title_ru = alt_title_tag.text.strip()

            if title_ru == title_en:
                title_ru = ""

            # IMDb рейтинг
            rating_tag = item.find("span", class_="ipc-rating-star--rating")
            rating = rating_tag.text.strip() if rating_tag else "N/A"

            # Постер
            poster_tag = item.find("img", class_="ipc-image")
            poster_url = poster_tag["src"] if poster_tag else ""

            anime_list.append({
                "ID": len(anime_list) + 1,  # Добавляем порядковый номер
                "TitleEN": title_en,
                "TitleRU": title_ru,
                "URL": title_url,
                "TTID": ttid,
                "IMDbRating": rating,
                "Poster": poster_url
            })

        # Пытаемся найти кнопку "50 more"
        try:
            see_more_span = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located(
                    (By.XPATH, "//span[contains(@class, 'ipc-see-more__text') and text()='50 more']"))
            )
            button = see_more_span.find_element(By.XPATH, "./ancestor::button")
            ActionChains(driver).move_to_element(button).click().perform()
            time.sleep(delay)  # Ждём загрузку новых данных
        except:
            print("Кнопка '50 more' не найдена или больше нет страниц.")
            break  # Если кнопки нет — выходим

    driver.quit()

    return anime_list[:limit]  # Обрезаем список по лимиту


if __name__ == "__main__":
    anime_data = get_anime_list(limit=100, delay=2)
    with open("anime_list.json", "w", encoding="utf-8") as f:
        json.dump(anime_data, f, ensure_ascii=False, indent=4)
    print(f"Данные сохранены в anime_list.json ({len(anime_data)} записей)")
