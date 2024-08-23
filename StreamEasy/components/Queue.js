import React, {  useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import Options from './Options.js';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const RightBar = (props) => {
    const songs = props.songs;
    const curr = props.curr;
    const playlist = props.playlist;
    const shuffle = props.shuffle;
    const [queue, setQueue] = useState([]);
    const [manualQueue, setManualQueue] = useState([]);
    const [option, setOption] = useState(false);
    const [id, setId] = useState(null);
    const [isManual, setIsManual] = useState(false);

    useEffect(() => {
        if (songs.playlist_title === null) {
            return;
        }
        fetch('http://192.168.4.132:5050/shuffle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ shuffle: false, playlist_title: playlist.replace(/ /g, ""), index: props.index })
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
    }, [songs.playlist_title, props.index]);

    useEffect(() => {
        if (songs.playlist_title === null) {
            return;
        }
        fetch('http://192.168.4.132:5050/shuffle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ shuffle: shuffle, playlist_title: playlist.replace(/ /g, ""), index: props.index })
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
    }, [shuffle]);

    useEffect(() => {
        setQueue(props.queue);
    }, [props.queue]);

    useEffect(() => {
        setManualQueue(props.manualQueue);
    }, [props.manualQueue]);

  const setSource = (album) => {
    if (!album) {
      return null;
    }
    const filename = album.replace(/ /g, '').replace(/[?!]/g, '') + '.jpg';
    const albumUrl = `http://192.168.4.132:5050/album-covers/${filename}`;
    return albumUrl;
  }

    const addToQueue = (id) => {
        fetch('http://192.168.4.132:5050/add-to-queue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ playlist_title: playlist, id: id })
        })
        .then(response => response.json())
        .then(data => {
            setManualQueue(data);
            props.updateManualQueue(data);
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
            console.log('An error occured trying to get the playlist data.');
        });
    };

    const clearQueue = () => {
        fetch('http://192.168.4.132:5050/clear-queue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            setManualQueue([]);
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
            console.log('An error occured trying to clear the queue.');
        });
    };

    const removeFromQueueManual = (id) => {
        fetch('http://192.168.4.132:5050/remove-from-manual-queue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ playlist_title: playlist, id: id })
        })
        .then(response => response.json())
        .then(data => {
            setManualQueue(data);
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
            console.log('An error occured trying to remove the song.');
        });
    };

    const removeFromQueue = (id) => {
        fetch('http://192.168.4.132:5050/remove-from-queue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ playlist_title: playlist, id: id })
        })
        .then(response => response.json())
        .then(data => {
            setQueue(data);
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
            console.log('An error occured trying to remove the song.');
        });
    }

    const showOptions = (id, isManual) => {
        setOption(!option);
        setId(id);
        setIsManual(isManual);
    }

    const styles = StyleSheet.create({
        queueContainer: {
            backgroundColor: '#242424',
            height: '100%',
            marginTop: 40,
            overflowY: 'hidden',
            overflowX: 'hidden',
            paddingBottom: 80,
            position: 'relative',
        },
        navRow: {
            marginTop: '5%',
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            marginBottom: '5%',
        },
        title: {
            color: '#fff',
            fontSize: 16,
            textAlign: 'center',
            flex: 1,
        },
        openQueueIcon: {
            left: 25,
            color: '#fff',
            fontSize: 35,
        },
        queueText: {
          color: '#fff',
          paddingLeft: 10,
          fontWeight: 'bold',
          fontSize: 16,
          marginBottom: 5,
        },
        queueRow: {
            width: '100%',
            paddingVertical: 5,
            marginBottom: 10,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            overflow: 'hidden',
        },
        // Hover states aren't directly supported in React Native
        shufflePlaylist: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        shuffleButton: {
          color: '#fff',
          alignSelf: 'center',
          margin: 'auto',
        },
        clicked: {
          color: 'rgb(69, 255, 69)',
        },
        albumCover: {
            justifyContent: 'center',
            alignItems: 'center',
            paddingRight: '2%',
            marginLeft: '2%',
        },
        albumImg: {
            borderRadius: 5,
            height: 50,
            width: 50,
            justifyContent: 'center',
            alignItems: 'center',
        },
        songNameArtist: {
            width: '65%',
            overflow: 'hidden',
        },
        songName: {
            margin: 5,
            fontSize: 16,
            color: '#fff',
        },
        artistName: {
            margin: 5,
            fontSize: 16,
            color: '#fff',
            opacity: 0.7,
        },
        clear: {
            margin: 'auto',
            marginRight: 10,
        },
        clearText: {  // Separate style for nested p tags
            color: '#fff',
            fontSize: 16,
            opacity: '0.7',
        },
        options: {
          alignSelf: 'center',
          margin: 'auto',
          color: '#fff',
          flexDirection: 'row',  // Flexbox for aligning items
          position: 'relative',
        },
        icon: {
            color: '#fff',
            fontSize: 30,
        },
        dropdownMenu: {
          position: 'absolute',
          backgroundColor: '#121212',
          minWidth: 200,
          justifyContent: 'center',
          marginRight: 30,
          marginTop: 32,
          right: 0,
          zIndex: 1,
          padding: 0,
        },
        dropdownMenuItem: {
          color: '#fff',
          padding: 12,
          fontSize: 15,
          fontFamily: 'Lato, sans-serif',  // Specify custom fonts with Font support in RN
        },
        manualQueueNav: {
            width: '100%',
            flexDirection: 'row',
        },
      });

  return (
    <View style={styles.queueContainer}>
        <ScrollView>
            <View style={styles.navRow}>
                <TouchableOpacity onPress={props.openQueue}>
                    <FontAwesome style={styles.openQueueIcon} name='angle-down'></FontAwesome>
                </TouchableOpacity>
                <Text style={styles.title}>{playlist}</Text>
            </View>
            <Text style={styles.queueText}>Now Playing</Text>
            <View style={styles.queueRow}>
                <View style={styles.albumCover}>
                    <Image src={setSource(curr.album)} alt={curr.album} style={styles.albumImg}></Image>
                </View>
                <View style={styles.songNameArtist}>
                    <Text style={styles.songName}>{curr.song_name}</Text>
                    <Text style={styles.artistName}>{curr.artist}</Text>
                </View>
                <TouchableOpacity onPress={() => showOptions(curr.id, false)} style={styles.options}>
                    <FontAwesome style={styles.icon} name='ellipsis-h'></FontAwesome>
                </TouchableOpacity>
            </View>
            {manualQueue.length !== 0 && 
            <View style={styles.manualQueueNav}>
                <Text style={styles.queueText}>Next in Queue</Text>
                <TouchableOpacity style={styles.clear} onPress={clearQueue}>
                    <Text style={styles.clearText}>Clear Queue</Text>
                </TouchableOpacity>
            </View>}
            {Array.isArray(manualQueue) && manualQueue.map((song, index) => (
                <View key={index} aria-rowindex={index + 1} style={styles.queueRow}>
                    <View style={styles.albumCover}>
                        <Image src={setSource(song.album)} alt={song.album} style={styles.albumImg}></Image>
                    </View>
                    <View style={styles.songNameArtist}>
                        <Text style={styles.songName}>{song.song_name}</Text>
                        <Text style={styles.artistName}>{song.artist}</Text>
                    </View>
                    <TouchableOpacity onPress={() => showOptions(song.id, true)} style={styles.options}>
                        <FontAwesome style={styles.icon} name='ellipsis-h'></FontAwesome>
                    </TouchableOpacity>
                </View>
            ))}
            <Text style={styles.queueText}>Next from {playlist}</Text>
            {Array.isArray(queue) && queue.map((song, index) => (
                <View key={index} aria-rowindex={index + 1} style={styles.queueRow}>
                    <View style={styles.albumCover}>
                        <Image src={setSource(song.album)} alt={song.album} style={styles.albumImg}></Image>
                    </View>
                    <View style={styles.songNameArtist}>
                        <Text style={styles.songName}>{song.song_name}</Text>
                        <Text style={styles.artistName}>{song.artist}</Text>
                    </View>
                    <TouchableOpacity onPress={() => showOptions(song.id, false)} style={styles.options}>
                        <FontAwesome style={styles.icon} name='ellipsis-h'></FontAwesome>
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
        {option && 
            <Options changeOption={setOption} addToQueue={addToQueue} removeFromQueue={removeFromQueue} removeFromQueueManual={removeFromQueueManual} id={id} isManual={isManual}/>
        }
    </View>
  )
}

export default RightBar