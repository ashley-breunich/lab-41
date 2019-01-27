import * as Expo from 'expo';
import React from 'react';
import { Pedometer, Accelerometer } from 'expo';
import { StyleSheet, Text, View, TextInput, Picker, Image, Button, AppRegistry, TouchableOpacity, TouchableHighlight } from 'react-native';
import { hide } from 'expo/build/launch/SplashScreen';
import If from './src/components/if.js';

export default class PedometerSensor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isPedometerAvailable: "unknown",
      pastStepCount: 0,
      currentStepCount: 0,
      days: 1, 
      showSteps: false,
      showLive: false,
      accelerometerData: {},
    }
  }

  componentDidMount() {
    this._subscribe();
    // this._toggle();
  }

  componentDidUpdate() {
    // this._subscribe();
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - this.state.days);
      Pedometer.getStepCountAsync(start, end).then(
        result => {
          this.setState({ pastStepCount: result.steps });
        },
        error => {
          this.setState({
            pastStepCount: "Could not get stepCount: " + error
          });
        }
      );
  }

  componentWillUnmount() {
    this._unsubscribe();
    // this._disconnect();
    window.removeEventListener('beforeunload', this._unsubscribe);
  }

  _subscribe = () => {
    this._subscription = Pedometer.watchStepCount(result => {
      this.setState({
        currentStepCount: result.steps
      });
    });

    Pedometer.isAvailableAsync().then(
      result => {
        this.setState({
          isPedometerAvailable: String(result)
        });
      },
      error => {
        this.setState({
          isPedometerAvailable: "Could not locate device's pedometer" + error
        });
      }
    );
  
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - this.state.days);
      Pedometer.getStepCountAsync(start, end).then(
        result => {
          this.setState({ pastStepCount: result.steps });
        },
        error => {
          this.setState({
            pastStepCount: "Could not get stepCount: " + error
          });
        }
      );
    };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  viewSteps = () => {
    this.componentDidUpdate();
    this.setState({
      showSteps: true,
      pastStepCount: this.state.pastStepCount + this.state.currentStepCount,
    });
    console.log(this.state.pastStepCount, 'past step count');
  };

  liveSteps = () => {
    this.setState({
      showLive: true,
      days: 1,
      currentStepCount: 0
    });
  };

  home = () => {
    this.setState({
      showSteps: false,
      showLive: false
    });
  }

  clear = () => {
    this.setState({
      pastStepCount: this.state.pastStepCount + this.state.currentStepCount,
      showSteps: false,
      showLive: false,
    });
  }

  render() {
    return (
      <>
      <View style={styles.container}>
      <TouchableHighlight onPress={this.home} underlayColor={"#00B29E"}>
        <Image source={require('./src/images/quick-step.png')} />
      </TouchableHighlight>
        <If condition={!this.state.showSteps && !this.state.showLive}>
          <TouchableOpacity style={styles.button} onPress={this.viewSteps}>
            <Text style={styles.buttonText}>View Steps Recap</Text>
          </TouchableOpacity>
        </If>
        <If condition={!this.state.showLive && !this.state.showSteps}>
          <TouchableOpacity style={styles.button} onPress={this.liveSteps}>
            <Text style={styles.buttonText}>Track Live Steps</Text>
          </TouchableOpacity>
        </If>
        <If condition={this.state.showSteps}>
          <Text style={[styles.main]}>
            {this.state.days} Day Recap 
          </Text>
          <Text style={styles.stats}>
            {this.state.pastStepCount} Total Steps
          </Text>
          <Text style={styles.description}>
            Scroll to choose a time frame:
          </Text>
          <Picker selectedValue={this.state.days} style={{height: 50, width: 100}} itemStyle = {styles.pickerItem} onValueChange={(itemValue, itemIndex) => this.setState({days: itemValue})}>
            <Picker.Item style={[styles.pickerItem]} label="24 Hours" value="1" />
            <Picker.Item label="48 Hours" value="2" />
            <Picker.Item label="72 hours" value="3" />
            <Picker.Item label="4 Days" value="4" />
            <Picker.Item label="5 Days" value="5" />
            <Picker.Item label="6 Days" value="6" />
            <Picker.Item label="7 Days" value="7" />
          </Picker>
        </If>
        <If condition={this.state.showLive}>
          <Text style={[styles.main]}>
            Start Walking!
          </Text>
          <Text style={styles.stats}>
            You have taken {this.state.currentStepCount} steps.
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.clear}>
            <Text style={styles.buttonText}>Add to current steps</Text>
          </TouchableOpacity>
        </If>
      </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    backgroundColor: "#00B29E",
    marginTop: 25,
    alignItems: "center",
    paddingTop: 30,

  },
  container: {
    marginTop: 25,
    paddingTop: 25,
    flex: 1,
    alignItems: "center",
    backgroundColor: "#00B29E",
  },
  main: {
    fontSize: 62,
    fontFamily: "HelveticaNeue-Thin",
    letterSpacing: 2.5,
    marginTop: 30,
    marginBottom: 15,
    color: '#00FFE2',
  },
  stats: {
    fontSize: 30,
    fontFamily: "HelveticaNeue-CondensedBold",
    textTransform: "uppercase",
    letterSpacing: 3.5,
    color: '#fafafa',
    textAlign: "center",
  },
  pickerItem: {
    color: '#00FFE2',
    fontFamily: "HelveticaNeue-Light",
    letterSpacing: 2,
    fontSize: 22,
  },
  description: {
    fontFamily: "HelveticaNeue-Light",
    fontSize: 18,
    marginTop: 12,
    color: '#fafafa',
    letterSpacing:.1,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#f7d162',
    padding: 25,
    marginTop: 50,
  },
  buttonText: {
    fontFamily: "HelveticaNeue-Light",
    fontSize: 20,
    color: "#333",
    letterSpacing: .5,
  }
});

Expo.registerRootComponent(PedometerSensor);