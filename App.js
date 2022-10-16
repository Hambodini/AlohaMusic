import React, { Component } from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

const drums = require('./music/drums.mp3');
const ukulele = require('./music/ukulele.mp3');
const drumImg = require('./images/drums.png');
const ukuleleImg = require('./images/ukulele.png');

export default class App extends Component {
  state = {
    isDrumsPlaying: false,
    isUkulelePlaying: false,
    isDrumsCurrent: false,
    isUkuleleCurrent: false,
    isPlaying: false,
    playbackInstance: null,
    isBuffering: false,
    volume: 1.0,
  }

  async componentDidMount() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playThroughEarpieceAndroid: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    });
    this.loadUkuleleAudio();
  }

  async loadDrumsAudio() {
    
    const playbackInstance = new Audio.Sound();
		
    const status = {
			shouldPlay: this.state.isDrumsPlaying,
			volume: this.state.volume,
    };

    playbackInstance
    .setOnPlaybackStatusUpdate(
      this.onPlaybackStatusUpdate
    );

    await playbackInstance.loadAsync(require('./music/drums.mp3'), status, false);
    
    this.setState({
      playbackInstance
    });
  }

  async loadUkuleleAudio() {
    
    const playbackInstance = new Audio.Sound();
		
    const status = {
			shouldPlay: this.state.isUkulelePlaying,
			volume: this.state.volume,
    };

    playbackInstance
    .setOnPlaybackStatusUpdate(
      this.onPlaybackStatusUpdate
    );

    await playbackInstance.loadAsync(require('./music/ukulele.mp3'), status, false);
    
    this.setState({
      playbackInstance
    });
  }

  onPlaybackStatusUpdate = (status) => {
    this.setState({
      isBuffering: status.isBuffering
    });
  }

  handleUkulele = async () => {
    const { playbackInstance, isDrumsCurrent } = this.state;
    
    if (isDrumsCurrent) {
      await playbackInstance.unloadAsync();
      
      await this.loadUkuleleAudio();
      
      this.setState({
        isDrumsPlaying: false,
        isDrumsCurrent: false
      });
    }
    this.UkulelePlayPause();
  }

  UkulelePlayPause = async () => {
    const { playbackInstance, isUkulelePlaying } = this.state;
    
    isUkulelePlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync();
    
    this.setState({
      isUkulelePlaying: !isUkulelePlaying,
      isUkuleleCurrent: true
    });
  }

  handleDrum = async () => {
    const { playbackInstance, isUkuleleCurrent } = this.state;

    if (isUkuleleCurrent) {  
      await playbackInstance.unloadAsync();
      
      await this.loadDrumsAudio();
      
      this.setState({
        isUkulelePlaying: false,
        isUkuleleCurrent: false
      });
    }
    this.DrumPlayPause();
  }

  DrumPlayPause = async () => {
    const { playbackInstance, isDrumsPlaying } = this.state;
    
    isDrumsPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync();
    
    this.setState({
      isDrumsPlaying: !isDrumsPlaying,
      isDrumsCurrent: true
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Aloha Music</Text>
        <Image source={ukuleleImg} style={styles.img} />
        <TouchableOpacity
          style={styles.playpause}
          onPress={this.handleUkulele}>
          {this.state.isUkulelePlaying ?
            <Feather name="pause" size={32} color="#563822" /> :
            <Feather name="play" size={32} color="#563822" />
          }
        </TouchableOpacity>

        <Image source={drumImg} style={styles.img} />
        <TouchableOpacity
          style={styles.playpause}
          onPress={this.handleDrum}>
          {this.state.isDrumsPlaying ?
            <Feather name="pause" size={32} color="#563822" /> :
            <Feather name="play" size={32} color="#563822" />
          }
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4e3cf',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 35,
    backgroundColor: '#da9547',
    width: 350,
    textAlign: 'center',
    color: '#563822',
    fontWeight: 'bold',
    marginBottom: 20
  },
  playpause: {
    margin: 20,
    alignItems: 'center'
  },
  img: {
    width: 350,
    height: 210
  },
});