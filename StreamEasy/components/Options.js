import React, {  useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

function Options(props) {
    const addToQueue = () => {
        props.addToQueue(props.id);
        props.changeOption(false);
    }

    const removeFromQueue = () => {
        if (props.isManual) {
            props.removeFromQueueManual(props.id);
        } else {
            props.removeFromQueue(props.id);
        }
        props.changeOption(false);
    }

    const exitOptions = () => {
        props.changeOption(false);
    }

    const styles = StyleSheet.create({
        optionsContainer: {
            bottom: 0,
            left: 0,
            zIndex: 999,
            height: '40%',
            width: '100%',
            backgroundColor: '#fff',
            position: 'absolute',
        },
        row: {
            paddingVertical: 5,
            marginBottom: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
        },
        icon: {
            color: '#121212',
            fontSize: 25,
            padding: 10,
        },
        text: {
            color: '#121212',
            fontSize: 18,
        },
      });

  return (
    <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.row} onPress={addToQueue}>
            <FontAwesome style={styles.icon} name='plus'></FontAwesome>
            <Text style={styles.text}>Add to Queue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={removeFromQueue}>
            <FontAwesome style={styles.icon} name='minus'></FontAwesome>
            <Text style={styles.text}>Remove from Queue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={exitOptions}>
            <FontAwesome style={styles.icon} name='close'></FontAwesome>
            <Text style={styles.text}>Cancel</Text>
        </TouchableOpacity>
    </View>
  )
}

export default Options