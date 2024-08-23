import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native';
import Songs from './Songs.js'
import SongBar from './SongBar.js'

function WebPlayer(props) {
  const [songs, setSongs] = useState([]);
  const [data, setData] = useState([]);
  const [num, setNum] = useState(0);
  const [curr, setCurr] = useState(-1);
  const [play, setPlay] = useState(false);
  const [skipForward, setSkipForward] = useState(false);
  const [skipBackward, setSkipBackward] = useState(false);
  const [queue, setQueue] = useState([]);
  const [manualQueue, setManualQueue] = useState([]);
//   const playlistTitle = songs.length > 0 ? songs[0].playlist_title : '';
  const playlist = props.playlist;
//   const playlist = displayPlaylist.replace(/ /g, "");
//   const [playlist, setPlaylist] = useState("");
//   const [displayPlaylist, setDisplayPlaylist] = useState("");

  const handleSkipForward = (skipForward) => {
    setSkipForward(skipForward);
  };

  const handleSkipBackward = (skipBackward) => {
    setSkipBackward(skipBackward);
  };

  useEffect(() => {
    // basically make the data have boolean value to either set the manual queue or the regular queue, change the jsonify basically
      if (songs.length === 0) {
        return;
      }
      if (manualQueue.length === 0) {
        fetch('http://192.168.4.132:5050/skip-song-forward', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const newIndex = data.index;
            setCurr(newIndex);
            setData(data.song);
            setQueue(data.queue);
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
            console.log('An error occured trying to skip to the next song.');
        });
      } else {
        fetch('http://192.168.4.132:5050/skip-song-forward-manual', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const newIndex = data.index;
            setCurr(newIndex);
            setData(data.song);
            setManualQueue(data.queue);
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
            console.log('An error occured trying to skip to the next song.');
        });
      }
  }, [skipForward]);

  useEffect(() => {
      if (songs.length === 0) {
        return;
      }
      if (manualQueue.length === 0) {
        fetch('http://192.168.4.132:5050/skip-song-backward', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const newIndex = data.index;
            setCurr(newIndex);
            setData(data.song);
            setQueue(data.queue);
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
            console.log('An error occured trying to skip to the next song.');
        });
      } else {
        fetch('http://192.168.4.132:5050/skip-song-backward-manual', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const newIndex = data.index;
            setCurr(newIndex);
            setData(data.song);
            setQueue(data.queue);
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
            console.log('An error occured trying to skip to the next song.');
        });
      }
  }, [skipBackward]);

  useEffect(() => {
      fetch('http://192.168.4.132:5050/webplayer', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ playlist_title: playlist })
      })
      .then(response => response.json())
      .then(data => {
          setSongs(data);
          console.log('Success:', data);
      })
      .catch((error) => {
          console.error('Error:', error);
          console.log('An error occured trying to get the playlist data.');
      });
  }, []);

  useEffect(() => {
      fetch('http://192.168.4.132:5050/shuffle', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ shuffle: false, playlist_title: playlist, index: 0 })
      })
      .then(response => response.json())
      .then(data => {
          setQueue(data);
          console.log('Success:', data);
      })
      .catch((error) => {
          console.error('Error:', error);
          console.log('An error occured trying to get the playlist data.');
      });
  }, []);

  const updateCurrSong = (index) => {
      setNum(index);
      setCurr(index);
      setData(songs[index]);
      setPlay(prevPlay => !prevPlay);
  }

//   const updateCurrPlaylist = (curr_playlist) => {
//     setPlaylist(curr_playlist.replace(/ /g, ""));
//     setDisplayPlaylist(curr_playlist);
//   }

  const handleManualQueue = (newQueue) => {
    setManualQueue(newQueue);
  }

  const goBack = () => {
    props.changeScreen();
  }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center'
        },
    });

  return (
    <View style={styles.container}>
      <Songs songs={songs} playlist={playlist} handleManualQueue={handleManualQueue} updateCurrSong={updateCurrSong} goBack={goBack} />
      <SongBar songs={songs} queue={queue} manualQueue={manualQueue} playlist={playlist} updateManualQueue={handleManualQueue} song={data} index={curr} start={play} length={songs.length} updateSongForward={handleSkipForward} updateSongBackward={handleSkipBackward} />
    </View>
  )
}

export default WebPlayer