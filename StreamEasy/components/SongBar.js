import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Queue from './Queue.js';

function SongBar(props) {
  const song = props.song;
  const [play, setPlay] = useState(true);
  const [prevSong, setPrevSong] = useState([]);
  const [time, setTime] = useState(0);
  const [index, setIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [skipForward, setSkipForward] = useState(true);
  const [skipBackward, setSkipBackward] = useState(true);
  const [sound, setSound] = useState(null);
  const [expand, setExpand] = useState(false);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  useEffect(() => {
    if (props.index !== index) {
      setTime(0);
      if (sound) {
        setPlay(true);
      }
    }
    setIndex(props.index);
  }, [props.index, index]);

  useEffect(() => {
    let interval = null;

    if (play && props.start !== null) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [play, props.start]);

  const setSource = (album) => {
    if (!album) {
      return null;
    }
    const filename = album.replace(/ /g, '').replace(/[?!]/g, '') + '.jpg';
    const albumUrl = `http://192.168.4.132:5050/album-covers/${filename}`;
    return albumUrl;
  }

  const setSong = (song_name, artist) => { 
    if (!song_name || !artist) {
      return null;
    }
    const songName = song_name.replace(/ /g, '').replace(/[?!]/g, '');
    const artistName = artist.replace(/ /g, '').replace(/[?!]/g, '');
    const filename = `${songName}-${artistName}.mp3`;
    const songUrl = `http://192.168.4.132:5050/songs/${filename}`;
    return songUrl;
  }

  // bypass silent mode when playing the song
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });
  }, []);

  const handlePlayClick = async() => {
    if (sound && prevSong === song.song_name) {
      await sound.playAsync();  // Resume playback
    } else {
      setPrevSong(song.song_name);
      const songUrl = setSong(song.song_name, song.artist);
      const { sound } = await Audio.Sound.createAsync({ uri: songUrl });
      setSound(sound);
      const status = await sound.getStatusAsync();
      setDuration(status.durationMillis / 1000);
      await sound.playAsync();  // Start playback
    }
  };

  const handlePauseClick = async () => {
    if (sound) {
      await sound.pauseAsync();
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handleClick = () => {
    setPlay(prevPlay => !prevPlay);
  }

  useEffect(() => {
      if (!play) {
        setPlay(true);
      } else {
        handlePlayClick();
      }
  }, [song]);

  useEffect(() => {
    if (play) {
      handlePlayClick();
    } else {
      handlePauseClick();
    }
  }, [play]);

  useEffect(() => {
    const width = (time / duration) * 100;
    // if the song finishes playing, update width of progress, otherwise reset and skip to next song
    if (duration !== time) {
      setProgress(width);
    } else {
      setTime(0);
      setPlay(false);
      setSkipForward(!skipForward);
      props.updateSongForward(skipForward);
    }
  }, [time]);

  const skipSongForward = () => {
    setPlay(false);
    setSkipForward(!skipForward);
    props.updateSongForward(skipForward);
  }

  const skipSongBackward = () => {
    setPlay(false);
    setSkipBackward(!skipBackward);
    props.updateSongBackward(skipBackward);
  }

  const expandSongPlayer = () => {
    setExpand(!expand);
  }

  const shufflePlaylist = () => {
    setShuffle(!shuffle);
  }

  const openQueue = () => {
    setShowQueue(!showQueue);
  }

  const styles = StyleSheet.create({
    songPlayer: {
      backgroundColor: '#D3B683',
      flexDirection: 'row',
      position: 'fixed', // Alternative: use position 'absolute' and control the bottom positioning
      bottom: 0,
      left: 0,
      zIndex: 999,
      width: '100%',
      height: 70,
    },
    songBarInfo: {
      width: '80%',
      paddingVertical: 5,
      marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      overflow: 'hidden',
    },
    albumCoverBottom: {
      alignSelf: 'center',
    },
    albumImgBottom: {
      borderRadius: 5,
      height: 50,
      width: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 5,
    },
    controls: {
      justifyContent: 'center',
      alignContent: 'center',
    },
    playStart: {
      justifyContent: 'center',
      marginTop: 20,
      flexDirection: 'row',
    },
    progressBar: {
      height: 20,
      backgroundColor: '#fff',
      overflow: 'hidden',
    },
    progress: {
      height: '100%',
      backgroundColor: '#242424',
    },
    songNameArtistBottom: {
        maxHeight: 50,
        width: '100%',
        overflow: 'hidden',
        justifyContent: 'flex-start',
        // backgroundColor: '#121212'
    },
    songNameBottomText: {
        margin: 5,
        fontSize: 16,
        color: '#fff',
    },
    songArtistBottomText: {
        margin: 5,
        fontSize: 16,
        color: '#fff',
        opacity: 0.7,
    },
    playContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto',
        height: 50,
        width: 50,
        borderRadius: 25,
    },
    playButton: {
        color: '#fff',
        fontSize: 20,
    },
    songPlayerExpand: {
      backgroundColor: '#D3B683',
      position: 'fixed', // Alternative: use position 'absolute' and control the bottom positioning
      bottom: 0,
      left: 0,
      zIndex: 999,
      width: '100%',
      height: '30%',
    },
    songBarInfoExpand: {
      paddingVertical: 5,
      // marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    albumCoverBottomExpand: {
      alignSelf: 'center',
    },
    albumImgBottomExpand: {
      borderRadius: 5,
      height: 60,
      width: 60,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 5,
    },
    controlsExpand: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignContent: 'center',
    },
    playStartExpand: {
      justifyContent: 'center',
      marginTop: 20,
      flexDirection: 'row',
    },
    progressBarExpand: {
      alignSelf: 'center',
      height: 20,
      width: '95%',
      backgroundColor: '#fff',
      overflow: 'hidden',
      borderRadius: 10,
    },
    progressExpand: {
      height: '100%',
      backgroundColor: '#242424',
      borderRadius: 10,
    },
    songNameArtistBottomExpand: {
        maxHeight: 80,
        width: '65%',
        overflow: 'hidden',
        justifyContent: 'flex-start',
    },
    songNameBottomTextExpand: {
        margin: 5,
        fontSize: 18,
        color: '#fff',
    },
    songArtistBottomTextExpand: {
        margin: 5,
        fontSize: 18,
        color: '#fff',
        opacity: 0.7,
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto',
        height: 50,
        width: 50,
        borderRadius: 25,
    },
    buttonExpand: {
        fontSize: 30,
        color: '#fff',
    },
    shufflePlaylistExpandGreen: {
        color: 'rgb(69, 255, 69);',
        fontSize: 30,
    },
  });

    return (
      <>
        {!expand ? 
        <>
          <TouchableOpacity onPress={expandSongPlayer} style={styles.songPlayer}>
            <View style={styles.songBarInfo}>
              <View style={styles.albumCoverBottom}>
                <Image source={{ uri: setSource(song.album) }} alt={song.album} style={styles.albumImgBottom} />
              </View>
              <View style={styles.songNameArtistBottom}>
                <Text style={styles.songNameBottomText}>{song.song_name}</Text>
                <Text style={styles.songArtistBottomText}>{song.artist}</Text>
              </View>
            </View>
            <View style={styles.controls}>
                <TouchableOpacity style={styles.playContainer} onPress={handleClick}>
                  <FontAwesome style={styles.playButton} name={play ? 'pause' : 'play'} />
                </TouchableOpacity>
            </View>
          </TouchableOpacity>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${progress}%` }]}></View>
          </View>
        </>
        :
        <>
        {!showQueue ? <TouchableOpacity onPress={expandSongPlayer} style={styles.songPlayerExpand}>
          <View style={styles.songBarInfoExpand}>
            <View style={styles.albumCoverBottomExpand}>
              <Image source={{ uri: setSource(song.album) }} alt={song.album} style={styles.albumImgBottomExpand} />
            </View>
            <View style={styles.songNameArtistBottomExpand}>
              <Text style={styles.songNameBottomTextExpand}>{song.song_name}</Text>
              <Text style={styles.songArtistBottomTextExpand}>{song.artist}</Text>
            </View>
          </View>
          <View style={styles.controlsExpand}>
              <TouchableOpacity style={styles.buttonContainer} onPress={shufflePlaylist}>
                <FontAwesome style={!shuffle ? styles.buttonExpand : styles.shufflePlaylistExpandGreen} name='random' />
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonContainer} onPress={skipSongBackward}>
                <FontAwesome style={styles.buttonExpand} name='backward' />
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonContainer} onPress={handleClick}>
                <FontAwesome style={styles.buttonExpand} name={play ? 'pause' : 'play'} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonContainer} onPress={skipSongForward}>
                <FontAwesome style={styles.buttonExpand} name='forward' />
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonContainer} onPress={openQueue}>
                <FontAwesome style={styles.buttonExpand} name='bars' />
              </TouchableOpacity>
            </View>
            <View style={styles.progressBarExpand}>
              <View style={[styles.progressExpand, { width: `${progress}%` }]}></View>
            </View>
        </TouchableOpacity>
        :
        <Queue openQueue={openQueue} songs={props.songs} index={props.index} curr={song} queue={props.queue} manualQueue={props.manualQueue} playlist={props.playlist} updateManualQueue={props.updateManualQueue} />
        }
        </>
        }
      </>
    );
  }

export default SongBar