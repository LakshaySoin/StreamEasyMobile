import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, ImageBackground, TextInput, TouchableWithoutFeedback, TouchableOpacity, Keyboard } from 'react-native';

function Form() {
    const [links, setLinks] = useState('');
    const [update, setUpdate] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
            setKeyboardVisible(true);
        }
        );
        const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
            setKeyboardVisible(false); 
        }
        );

        return () => {
        keyboardDidHideListener.remove();
        keyboardDidShowListener.remove();
        };
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const linksArray = links.split('\n').filter(link => link.trim() !== '');
        fetch('http://192.168.4.132:5050', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ links: linksArray })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            setUpdate(true); 
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while trying to send the links. Please wait to try again.');
        });
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        imageBackground: {
            flex: 1,
        },
        header: {
            color: '#fff',
            marginBottom: 20,
            marginTop: '15%',
            fontSize: 30,
            fontWeight: 'bold',
            textAlign: 'center'
        },
        text: {
            color: '#fff',
            marginBottom: 10,
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center'
        },
        textArea: {
            height: '60%',
            width: '80%',
            backgroundColor: '#242424',
            fontSize: 20,
            alignSelf: 'center',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: 30,
            textAlignVertical: 'top',
            padding: 10,
            borderColor: '#ccc',
            textAlign: 'left',
            marginBottom: '10%'
        },
        introBtns: {
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'row'
        },
        button: {
            paddingVertical: 15,
            paddingHorizontal: 30,
            borderRadius: 2,
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#fff',
            opacity: 0.8,
            marginRight: 10,
            marginLeft: 10
        },
        buttonText: {
            color: '#242424',
            textAlign: 'center',
            fontSize: 15
        },
    });

  return (
    <ImageBackground source={require('../assets/set-up-bg.jpg')} resizeMode="cover" style={styles.imageBackground}>
        <TouchableWithoutFeedback onPress={() => isKeyboardVisible && Keyboard.dismiss()}>
        <View style={styles.container}>
            {!update && <>
                <Text style={styles.header}>Transfer Spotify Playlists</Text>
                    <TextInput 
                        style={styles.textArea}
                        placeholder={`https://spotify.com/playlist-1\nhttps://spotify.com/playlist-2\n...`}
                        multiline={true}
                        numberOfLines={4}
                        placeholderTextColor={'#fff'}
                        value={links}
                        onChangeText={(e) => setLinks(e)}
                    />
                <TouchableOpacity title="Submit form" onPress={handleSubmit} style={styles.button}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </>
            }
            {update && <View style={styles.container}> 
                <Text style={styles.header}>Succesful Transfer!</Text>
                <TouchableOpacity title="Go to Webplayer" onPress={() => navigation.navigate('Playlists')} style={styles.button}>
                    <Text style={styles.buttonText}>Go to webplayer!</Text>
                </TouchableOpacity>
            </View>}
        </View>
        </TouchableWithoutFeedback>
    </ImageBackground>
  )
}

export default Form