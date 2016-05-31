/**
 * Weather using Yahoo! API
 * VijayS
 */

'use strict'

import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  NetInfo,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';

// URL is split to insert the city input from user
const REQUEST_URL_PART1 = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22';
const REQUEST_URL_PART2 = '%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';

const ALERT_MESSAGE_INTERNET_NOT_CONNECTED = 'Error connecting to the server..\nAre you connected to the internet?';

/* Not used - changed to direct submit but retaining for learning purpose
// Button template
const Button = ({title, onPress}) => (
  <TouchableHighlight 
    underlayColor = 'blue'
    onPress={onPress}
    style={styles.button}
  >
      <Text style={styles.centerText}>{title}</Text>
  </TouchableHighlight>
)
*/

class rn_weather_vj extends Component {
  
  constructor() {
    super();
    this.state = {
      cityInput: "",
      locationGot: "",
      temperatureGot: 0,
      conditionTextGot: "",
      temperatureInC: 0,
      networkConnected: false,
    }
  }

// Using NetInfo to check for internet connectivity
componentDidMount() {
    NetInfo.isConnected.addEventListener(
        'change',
        this.handleConnectivityChange.bind(this)
    );
    NetInfo.isConnected.fetch().done(
        (isConnected) => {this.setState({networkConnected: isConnected}); }
    );
  }
  
  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
        'change',
        this.handleConnectivityChange.bind(this)
    );
  }
  
  handleConnectivityChange(isConnected) {
    this.setState({
      networkConnected: isConnected,
    });
  }
  
  onButtonPress() {
    
    // If city is entered
    if (this.state.cityInput != "") {

      // if connected to internet
      if (this.state.networkConnected) {
        this.fetchData();
      }
      else {
        Alert.alert('', ALERT_MESSAGE_INTERNET_NOT_CONNECTED)
      }
    }
  }
  
  fetchData(){

    var formattedRequestURL = REQUEST_URL_PART1 + this.state.cityInput + REQUEST_URL_PART2;
    var temp=0;
    
    fetch(formattedRequestURL)
      .then((response) => response.json())
      .then((responseData) => {
          this.setState({
            locationGot: responseData.query.results.channel.title,
            conditionTextGot: responseData.query.results.channel.item.condition.text,
          })
          // call back in setState to calculate temperatureInC after temperatureGot's state is changed,
          // since setState is async, temperatureGot may still have old value due
          this.setState(
            {temperatureGot: responseData.query.results.channel.item.condition.temp},
              function afterTemperatureGot () {this.convertTemperatureToC();}
          )
      })
      .catch((error) => {
        Alert.alert('', ALERT_MESSAGE_INTERNET_NOT_CONNECTED);
      })
      .done();
  }

    // Yahoo! API's where clause with "and u='c'" is not working, hence,
    // this function converts temperature in Fahrenheit to Celcius
    convertTemperatureToC() {
        this.setState({
          temperatureInC: Math.round(((this.state.temperatureGot - 32) * 5 / 9))          
        }) 
    }

  render() {
    return (
      <View style={styles.containerHead}>
        <View>
          <Text style={styles.headerText}>
            Weather using Yahoo! API
          </Text>
          <Text style={styles.centerText}>
            VijayS
          </Text>
        </View>
        <View style={styles.containerContent}>
          <TextInput
            placeholder="Please enter city.."
            value={this.state.cityInput}
            style={styles.centerText}
            onChangeText={(cityInput) => this.setState({cityInput})}
            onSubmitEditing={this.onButtonPress.bind(this)}
          />
          {/*}          
          <Button title='Get Weather' onPress={this.onButtonPress.bind(this)} />
          */}
          <Text style={styles.centerText}>
            {this.state.locationGot}{"\n"}
            {this.state.temperatureGot}F, {this.state.temperatureInC}C{"\n"}
            {this.state.conditionTextGot}
          </Text>
        </View>
      </View>
    );
  }
}

/*
rn_weather_vj.PropTypes = {
  cityInput: React.PropTypes.string,
  locationGot: React.PropTypes.string,
  temperatureGot: React.PropTypes.number,
}

rn_weather_vj.defaultProps = {
  cityInput: "",
  locationGot: "",
  temperatureGot: 0,
}
*/

const styles = StyleSheet.create({
  containerHead: {
    flex: 1,
    justifyContent: 'center',
  },
  containerContent: {
    flex: 2,
    justifyContent: 'center',
  },
  button: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    backgroundColor: 'aquamarine'
  },
  headerText: {
    fontSize: 20,
    textAlign:'center', 
    color:'blue',
  },
  centerText: {
    fontSize: 20,
    textAlign: 'center',
  },
});

AppRegistry.registerComponent('rn_weather_vj', () => rn_weather_vj);
