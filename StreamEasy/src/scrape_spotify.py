# Implement dependencies for web scraping

from selenium import webdriver 
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains as AC
from seleniumbase import SB
import urllib
import os
import time
import yt_dlp

def scrape_playlist(playlist_url):
    with SB(uc=True) as driver:

    # driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))

        # Open spotify for data collection
        # driver.get("https://www.google.com/")
        driver.get(playlist_url)
        driver.maximize_window()
        
        # Store song names, artists, and album name/cover
        data = []
        src = []
        albums = []

        # Get the name of spotify playlist to use for youtube playlist
        playlist_name = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, 'rEN7ncpaUeSGL9z0NGQR'))
        )

        data.append(playlist_name.text)

        # Length of container with songs
        length = driver.execute_script("return document.querySelector('.lYpiKR_qEjl1jGGyEvsA').clientHeight")

        curr_length = 0

        action = AC(driver)

        while True:
            # Get album cover image
            album_covers = driver.find_elements(By.XPATH, '//*[@id="main"]/div/div[2]/div[3]/div[1]/div[2]/div[2]/div[2]/main/div[1]/section/div[2]/div[3]/div[1]/div[2]/div[2]/div/div/div[2]/img')

            # Get song and artist names on the current page
            elements = driver.find_elements(By.CLASS_NAME, '_iQpvk1c9OgRAc8KRTlH')

            album_names = driver.find_elements(By.XPATH, '//*[@id="main"]/div/div[2]/div[3]/div[1]/div[2]/div[2]/div[2]/main/div[1]/section/div[2]/div[3]/div[1]/div[2]/div[2]/div/div/div[3]')

            skips = []

            # Iterate through all song elements and append unique ones to array
            for i in range(len(elements)):
                info = elements[i].text.split("\n")
                song_name, artist_name = info[0], info[-1]
                arr = [song_name, artist_name]
                if arr not in data:
                    data.append(arr)
                else:
                    skips.append(i)

            for i in range(len(album_names)):
                if (i not in skips):
                    albums.append(album_names[i].text)

            for i in range(len(album_covers)):
                if (i not in skips):
                    img = album_covers[i]
                    src.append(img.get_attribute('src'))

            for i in range(len(src)):
                print(data[i + 1])
                print(albums[i])
                print(src[i])

            # Container to scroll within
            # scroll_box = driver.wait_for_element(
            #     '//*[@id="main"]/div/div[2]/div[3]/div[1]/div[2]/div[4]/div', by=By.XPATH, timeout=10
            # )

            # print(scroll_box)
            scroll_box = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, '//*[@id="main"]/div/div[2]/div[3]/div[1]/div[2]/div[2]'))
            )

            # Move down webpage (this doesn't accidently click album names)
            # action.click_and_hold(scroll_box).drag_and_drop_by_offset(scroll_box, 0, 50).perform()

            scroll_box.send_keys(Keys.PAGE_DOWN)

            # Calculate new scroll height and compare with last scroll height
            curr_length += 50

            time.sleep(1)

            # End scrolling
            if curr_length >= length:
                break

        # Remove recommended songs
        data = data[:-10]
        albums = albums[:len(data) - 1]
        src = src[:len(data) - 1]

        # Close the tab
        # driver.close()

        return [data, albums, src]

def save_data(arr, cursor, db, playlist_title_original):
    playlist_title = playlist_title_original.replace(" ", "")
    data = arr[0]
    albums = arr[1]
    src = arr[2]
    for i in range(len(albums)): 
        entry = (data[i + 1][0], data[i + 1][1], albums[i], playlist_title_original)
        add_to_db = True
        for row in cursor.execute("SELECT song_name, artist, album, playlist_title FROM " + playlist_title):
            if entry == row:
                add_to_db = False
        if (add_to_db):
            cursor.execute("INSERT INTO " + playlist_title + "(song_name, artist, album, playlist_title) VALUES(?, ?, ?, ?)", entry)
            db.commit()

    folder = "./data/album-covers"

    # Check if the folder already exists
    if not os.path.exists(folder):
        # Create the new folder
        os.makedirs(folder)

    try:
        for i in range(len(src)):
            file = albums[i].replace(" ", "").replace("?", "").replace("!", "")
            urllib.request.urlretrieve(str(src[i]), f"{folder}/{file}.jpg")
    except Exception as e:
        print(len(src))
        print(len(albums))
        print("the lengths are different", e)

def find_song(driver, search_bar, song):
    # Search for song
    search_bar.send_keys(song)
    search_bar.send_keys(Keys.RETURN)

    time.sleep(0.5)

    # Click on first video result
    video = driver.find_element(By.CSS_SELECTOR, 'a[id="video-title"]')
    video.click()

def convert_to_youtube(data_frame, username, password, playlist_title):
    with SB(uc=True) as driver:
        # Login to google account (bypasses the insecure page)
        driver.get("https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26hl%3Den%26next%3Dhttps%253A%252F%252Fwww.youtube.com%252F&ec=65620&hl=en&ifkv=AS5LTARVpfGfB8Iq0HL3aV_O1MY5qjuW5AlQiOnun0WuNxvOVTgB5Jh4I-ptBorc6RvhieqxgjYX&passive=true&service=youtube&uilel=3&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S-1859192857%3A1717365834211317&ddm=0")

        driver.type("#identifierId", username)
        driver.click("#identifierNext > div > button")

        driver.type("#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input", password)
        driver.click("#passwordNext > div > button")

        driver.maximize_window()

        time.sleep(3)

        # Locate youtube search bar
        search_bar = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//input[@id='search']"))
        )

        count = -1

        for songs in data_frame:
            find_song(driver, search_bar, songs)

            # Access save button
            selector = driver.find_element(By.XPATH, '//*[@id="button-shape"]/button')
            selector.click()
            save = driver.find_element(By.XPATH, '//*[@id="items"]/ytd-menu-service-item-renderer[2]/tp-yt-paper-item/yt-formatted-string')
            save.click()

            if count == -1:
                # Only create a playlist if its the first song
                create_playlist = driver.find_element(By.XPATH, '//*[@id="content-icon"]')
                create_playlist.click()

                # Name the playlist
                playlist_name = driver.find_element(By.XPATH, '//*[@id="input-2"]/input')
                playlist_name.send_keys(playlist_title)

                # Create playlist
                create = driver.find_element(By.XPATH, '//*[@id="actions"]/ytd-button-renderer/yt-button-shape/button/yt-touch-feedback-shape/div')
                create.click()
                count += 1
            else:
                # Find the names of all created playlists
                playlists = driver.find_element(By.ID, 'playlists')
                playlist_names = playlists.text.split("\n")

                for name in playlist_names:
                    # Add to playlist named after spotify playlist
                    if name == playlist_title:
                        add_to_playlist = driver.find_element(By.XPATH, f"//*[contains(text(),'{name}')]")
                        add_to_playlist.click()

def download_playlist(data_frame):
    with SB(uc=True) as driver:
        driver.get("https://www.youtube.com/")

        driver.maximize_window()

        time.sleep(3)

        # Locate youtube search bar
        search_bar = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//input[@id='search']"))
        )

        for songs in data_frame:
            song_text = songs[0] + " by " + songs[1]
            find_song(driver, search_bar, song_text)

            curr_url = driver.get_current_url()

            ydl_opts = {
                'format': 'm4a/bestaudio/best',
                'outtmpl': f'./data/songs/{songs[0].replace(" ", "").replace("?", "").replace("!", "")}-{songs[1].replace(" ", "").replace("?", "").replace("!", "")}',
                'postprocessors': [{  # Extract audio using ffmpeg
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                }]
            }

            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([f'{curr_url}'])

            # Clear the search bar so the next song search works correctly
            search_bar.clear()

        time.sleep(3)