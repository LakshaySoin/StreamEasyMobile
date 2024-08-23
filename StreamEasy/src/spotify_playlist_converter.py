# Implement dependencies for web scraping

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import dllist 
import scrape_spotify
import sqlite3
import numpy as np
import os

app = Flask(__name__)
# CORS(app)
CORS(app
    # r"/*": {
    #     "origins": ["http://localhost:3000"],  # Replace with your frontend URL
    #     "methods": ["GET", "POST", "PUT", "DELETE"],
    #     "allow_headers": ["Content-Type"]
    # }
)
main_db = "stream_easy"
queue = dllist.DLList()
manual_queue = dllist.DLList()
curr_playlist_index = 0

@app.route('/', methods=['POST'])
def receive_links():
    # Process links
    data = request.get_json()
    links = data.get('links', [])
    exec(links)
    return {}

@app.route('/songs/<filename>')
def get_song(filename):
    return send_from_directory('./data/songs', filename)

@app.route('/album-covers/<filename>')
def get_album_cover(filename):
    return send_from_directory('./data/album-covers', filename)

def check_playlists_exists():
    if (os.path.exists("stream_easy.db")):
        return True
    return False

def adjust_playlist(playlist_title):
    if (len(playlist_title) == 0):
        playlist_db, playlist_cursor = connect_to_db(main_db + ".db")
        playlist_title = playlist_cursor.execute(f"SELECT * FROM {main_db}").fetchall()[0][1]
        playlist_db.close()
    return playlist_title.replace(" ", "")
    
def find_song(cursor, playlist_title, id):
    song = ""
    for row in cursor.execute(f"SELECT song_name, artist, album, id FROM {playlist_title}"):
        if (row['id'] == id):
            song = row
            break
    return song


@app.route("/make-queue", methods=['POST', 'GET'])
def make_queue(shuffle=False, playlist_title=None, index=None):
    if (not check_playlists_exists()):
        return {}
    playlist_title = adjust_playlist(playlist_title)
    db, cursor = connect_to_db(playlist_title + ".db")
    cursor.row_factory = sqlite3.Row
    arr = []
    for row in cursor.execute(f"SELECT song_name, artist, album, id FROM {playlist_title}"):
        arr.append(row)
    db.close()
    temp = arr[index + 1:] + arr[:index]
    if (shuffle):
        np.random.shuffle(temp)
    queue.clear()
    for item in temp:
        queue.addLast(item)
    return jsonify([dict(item) for item in queue])

@app.route("/clear-queue", methods=['POST'])
def clear_queue():
    if (not check_playlists_exists()):
        return {}
    manual_queue.clear()
    return {} 

@app.route("/add-to-queue", methods=['GET', 'POST'])
def add_to_queue():
    if (not check_playlists_exists()):
        return {}
    data = request.get_json()
    id = data.get('id', [])
    playlist_title = data.get('playlist_title', [])
    playlist_title = adjust_playlist(playlist_title)
    db, cursor = connect_to_db(playlist_title + ".db")
    cursor.row_factory = sqlite3.Row
    song = find_song(cursor, playlist_title, id)
    db.close()
    manual_queue.addLast(dict(song))
    return jsonify([dict(item) for item in manual_queue])

@app.route("/remove-from-manual-queue", methods=['GET', 'POST'])
def remove_from_manual_queue():
    if (not check_playlists_exists()):
        return {}
    data = request.get_json()
    id = data.get('id', [])
    playlist_title = data.get('playlist_title', [])
    playlist_title = adjust_playlist(playlist_title)
    db, cursor = connect_to_db(playlist_title + ".db")
    cursor.row_factory = sqlite3.Row
    song = find_song(cursor, playlist_title, id)
    db.close()
    manual_queue.remove(dict(song))
    return jsonify([dict(item) for item in manual_queue])

@app.route("/remove-from-queue", methods=['GET', 'POST'])
def remove_from_queue():
    if (not check_playlists_exists()):
        return {}
    if (queue.isEmpty()):
        return {}
    data = request.get_json()
    id = data.get('id', [])
    playlist_title = data.get('playlist_title', [])
    playlist_title = adjust_playlist(playlist_title)
    db, cursor = connect_to_db(playlist_title + ".db")
    cursor.row_factory = sqlite3.Row
    song = find_song(cursor, playlist_title, id)
    db.close()
    queue.remove(song)
    return jsonify([dict(item) for item in queue])

@app.route("/skip-song-forward-manual", methods=['POST', 'GET'])
def get_manual_queue_forward():
    if (not check_playlists_exists()):
        return {}
    if (manual_queue.isEmpty()):
        return {}
    newCurrSong = dict(manual_queue.getNext())
    newIndex = newCurrSong['id'] - 1
    return jsonify({
        'queue': [dict(item) for item in manual_queue],
        'index': newIndex,
        'song': newCurrSong
    })

@app.route("/skip-song-backward-manual", methods=['POST', 'GET'])
def get_manual_queue_backward():
    if (not check_playlists_exists()):
        return {}
    if (manual_queue.isEmpty()):
        return {} 
    newCurrSong = dict(manual_queue.getPrev())
    newIndex = newCurrSong['id'] - 1
    return jsonify({
        'queue': [dict(item) for item in manual_queue],
        'index': newIndex,
        'song': newCurrSong
    })

@app.route("/skip-song-forward", methods=['POST', 'GET'])
def get_queue_forward():
    if (not check_playlists_exists()):
        return {}
    if (queue.isEmpty()):
        return {}
    newCurrSong = dict(queue.getNext())
    newIndex = newCurrSong['id'] - 1
    return jsonify({
        'queue': [dict(item) for item in queue],
        'index': newIndex,
        'song': newCurrSong
    })

@app.route("/skip-song-backward", methods=['POST', 'GET'])
def get_queue_backword():
    if (not check_playlists_exists()):
        return {}
    if (queue.isEmpty()):
        return {} 
    newCurrSong = dict(queue.getPrev())
    newIndex = newCurrSong['id'] - 1
    return jsonify({
        'queue': [dict(item) for item in queue],
        'index': newIndex,
        'song': newCurrSong
    })

@app.route("/shuffle", methods=['POST'])
def shuffle_playlist():
    if (not check_playlists_exists()):
        return {}
    data = request.get_json()
    shuffle = data.get('shuffle', [])
    playlist_title = data.get('playlist_title', [])
    index = data.get('index', [])
    return make_queue(shuffle, playlist_title, index)

@app.route("/webplayer", methods=['GET', 'POST'])
def get_items():
    if (not check_playlists_exists()):
        return {}
    data = request.get_json()
    playlist_title = data.get('playlist_title', [])
    playlist_title = adjust_playlist(playlist_title)
    db, cursor = connect_to_db(playlist_title + ".db")
    cursor.row_factory = sqlite3.Row
    items = cursor.execute(f"SELECT * FROM {playlist_title}").fetchall()
    db.close()
    return jsonify([dict(item) for item in items])

@app.route("/get-playlists", methods=['POST'])
def get_playlists():
    if (not check_playlists_exists()):
        return {}
    playlist_db, playlist_cursor = connect_to_db(main_db + ".db")
    playlist_cursor.row_factory = sqlite3.Row
    playlist_names = [row['playlist_title'] for row in playlist_cursor.execute(f"SELECT playlist_title FROM {main_db}")]
    playlist_db.close()

    items = []
    for name in playlist_names:
        curr_db, curr_cursor = connect_to_db(name + ".db")
        curr_cursor.row_factory = sqlite3.Row
        albums = [dict(row) for row in curr_cursor.execute(f"SELECT album FROM {name} LIMIT 4").fetchall()]
        playlist_title = curr_cursor.execute(f"SELECT * FROM {name}").fetchall()[0][4]
        items.append({"name": playlist_title, "albums": albums})
        curr_db.close()
    
    return jsonify(items)

def connect_to_db(name):
    name = name.replace(" ", "")
    db = sqlite3.connect(name)
    cursor = db.cursor()
    return [db, cursor]

def exec(playlist_urls):
    
    playlist_db, playlist_cursor = connect_to_db(main_db + ".db")

    playlist_cursor.execute(f"CREATE TABLE IF NOT EXISTS {main_db} (id INTEGER PRIMARY KEY AUTOINCREMENT, playlist_title TEXT UNIQUE)")
    playlist_db.commit()

    # Grab song data
    for playlist_url in playlist_urls:

        arr = scrape_spotify.scrape_playlist(playlist_url)

        playlist_title_original = arr[0][0]

        playlist_title = playlist_title_original.replace(" ", "")
        
        db, cursor = connect_to_db(playlist_title + ".db")

        cursor.execute(f"CREATE TABLE IF NOT EXISTS {playlist_title} (id INTEGER PRIMARY KEY AUTOINCREMENT, song_name, artist, album, playlist_title)")
        db.commit()

        songs_to_download = clean_data(arr[0][1:], cursor, playlist_title)

        scrape_spotify.save_data(arr, cursor, db, playlist_title_original)

        playlists_added = []
        for row in playlist_cursor.execute(f"SELECT playlist_title FROM {main_db}"):
            playlists_added.append(row[0])

        if (playlist_title not in playlists_added):
            playlist_cursor.execute(f"INSERT INTO {main_db} (playlist_title) VALUES(?)", (playlist_title,))
            playlist_db.commit()

        # Search songs and download to desktop
        if (len(songs_to_download) > 0):
            scrape_spotify.download_playlist(songs_to_download)

        db.close()

    playlist_db.close()

def clean_data(data, cursor, playlist_title):
    cleaned_data = []
    songs_added = []
    for song in cursor.execute(f"SELECT song_name, artist FROM {playlist_title}"):
        songs_added.append(song)
    for element in data:
        if (tuple(element) not in songs_added):
            cleaned_data.append(element)
    return cleaned_data

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5050, debug=True)