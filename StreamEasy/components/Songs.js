import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

function Songs(props) {
  const songs = props.songs;
  const playlist = props.playlist;

  const updateCurrSong = (index) => {
    props.updateCurrSong(index);
  }

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
          props.handleManualQueue(data);
          console.log('Success:', data);
      })
      .catch((error) => {
          console.error('Error:', error);
          console.log('An error occured trying to get the playlist data.');
      });
  };

  const styles = StyleSheet.create({
    songListContainer: {
        flex: 1,
        backgroundColor: '#121212',
        position: 'relative',
    },
    title: {
        color: '#fff',
        marginBottom: 20,
        marginTop: '2%',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    songRow: {
        width: '100%',
        paddingVertical: 5,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        overflow: 'hidden',
    },
    albumCover: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: '2%',
    },
    albumImg: {
        borderRadius: 5,
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    songNameArtistMain: {
        width: '65%',
        overflow: 'hidden',
    },
    songNameMainText: {
        margin: 5,
        fontSize: 16,
        color: '#fff',
    },
    songArtistMainText: {
        margin: 5,
        fontSize: 16,
        color: '#fff',
        opacity: 0.7,
    },
    addQueue: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#242424',
        margin: 'auto',
        height: 32,
        width: 32,
        borderRadius: 16,
    },
    text: {
        color: '#fff',
        fontSize: 16,
    },
    playlistTitle: {
        backgroundColor: '#FF474C',
        marginBottom: 20,
        // position: 'absolute',
        top: 0,
        left: 0,
    },
    number: {
        marginLeft: '2%',
        marginRight: '2%',
    },
    plusButton: {
      color: '#fff',
      fontSize: 16,
    },
    backButton: {
        marginTop: '10%',
        color: '#fff',
        fontSize: 30,
        paddingLeft: 15,
    },
});

  return (
    <ScrollView style={styles.songListContainer}>
        <View style={styles.playlistTitle}>
          <TouchableOpacity onPress={() => props.goBack()}>
            <FontAwesome style={styles.backButton} name='angle-left' />
          </TouchableOpacity>
          <Text style={styles.title}>{playlist}</Text>
        </View>
        <View style={styles.songListContainer}>
          {Array.isArray(songs) && songs.map((song, index) => (
              <TouchableOpacity onPress={() => updateCurrSong(index)} key={index} aria-rowindex={index + 1} style={styles.songRow}>
                <View style={styles.number}>
                    <Text style={styles.text}>{index + 1}</Text>
                </View>
                <View style={styles.albumCover}>
                    <Image source={{ uri: setSource(song.album) }} alt={song.album} style={styles.albumImg}></Image>
                </View>
                <View style={styles.songNameArtistMain}>
                    <Text style={styles.songNameMainText}>{song.song_name}</Text>
                    <Text style={styles.songArtistMainText}>{song.artist}</Text>
                </View>
                <TouchableOpacity onPress={() => addToQueue(song.id)} style={styles.addQueue}>
                  <FontAwesome style={styles.plusButton} name='plus' />
                </TouchableOpacity>
              </TouchableOpacity>
          ))}
        </View>
    </ScrollView>
  )
}

export default Songs