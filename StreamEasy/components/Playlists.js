import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import WebPlayerParent from './WebPlayerParent';

function LeftBar() {
  const [playlists, setPlaylists] = useState([]);
  const [show, setShow] = useState(false);
  const [currPlaylist, setCurrPlaylist] = useState("");

  const setSource = (album) => {
    let album_name = album.album;
    console.log(album_name);
    try {
        const filename = album_name.replace(/ /g, '').replace(/[?!]/g, '') + '.jpg';
        const albumUrl = `http://192.168.4.132:5050/album-covers/${filename}`;
        return albumUrl;
    } catch (err) {
        return null;
    }
  }

  useEffect(() => {
      fetch('http://192.168.4.132:5050/get-playlists', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
      })
      .then(response => response.json())
      .then(data => {
          setPlaylists(data);
          console.log('Success:', data);
      })
      .catch((error) => {
          console.error('Error:', error);
          console.log('An error occured trying to get the playlist cards.');
      });
  }, []);

  const changePlaylist = (playlist_name) => {
    setShow(!show);
    setCurrPlaylist(playlist_name);
  }

  const changeScreen = () => {
    setShow(false);
  }

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#121212',
          marginTop: 20,
        },
        title: {
          color: '#fff',
          marginBottom: 20,
          marginTop: '10%',
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center'
      },
      playlistName: {
          color: '#fff',
          fontSize: 18,
          textAlign: 'center'
      },
      cardRow: {
          backgroundColor: '#242424',
          borderRadius: 10,
          flexDirection: 'row',
          height: 100,
          marginBottom: 10,
      },
      cardName: {
          paddingLeft: 15,
          alignSelf: 'center', // Center content
      },
      cardImage: {
          paddingLeft: 5,
          width: 80,
          height: 80,
          alignSelf: 'center',
          flexWrap: 'wrap',
      },
      playlistImage: {
          width: 40,
          height: 40,
      },
    });

  return (
    <>
      {!show ? 
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Playlists</Text>
          {Array.isArray(playlists) && playlists.length !== 0 && playlists.map((playlist, index) => (
            <TouchableOpacity onPress={() => changePlaylist(playlist.name)} aria-rowindex={index + 1} style={styles.cardRow}>
              <View key={index} style={styles.cardImage}>
                  {playlist.albums.map((album)  => (
                    <Image source={{ uri: setSource(album) }} alt={album} style={styles.playlistImage}></Image>
                  ))}
              </View>
              <View style={styles.cardName}>
                <Text style={styles.playlistName}>{playlist.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      :
        <WebPlayerParent playlist={currPlaylist} changeScreen={changeScreen} />}
    </>
  )
}

export default LeftBar