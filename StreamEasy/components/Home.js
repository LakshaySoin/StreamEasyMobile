import React from 'react'
import { StyleSheet, View, Text, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';

function Home({ navigation }) {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginTop: 20
        },
        imageBackground: {
            flex: 1,
        },
        header: {
            color: '#fff',
            marginBottom: '60%',
            marginTop: '25%',
            fontSize: 40,
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
        introBtns: {
            alignItems: 'center',
            justifyContent: 'center',
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
    <View style={styles.container}>
        <ImageBackground source={require('../assets/intro-bg.jpg')} resizeMode="cover" style={styles.imageBackground}>
            <Text style={styles.header}>Music Tailored to You!</Text>
            <Text style={styles.text}>Dive into songs from your favorite artists!</Text>
            <View style={styles.introBtns}>
                <TouchableOpacity onPress={() => navigation.navigate('Set Up')} style={styles.button}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Playlists')} style={styles.button}>
                    <Text style={styles.buttonText}>Listen Now!</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    </View>
  )
}

export default Home