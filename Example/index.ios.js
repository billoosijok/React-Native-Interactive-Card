/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  ListView
} from 'react-native';

import App from './App.js'



export default class Example extends Component {

  render() {

    return (
	    <App />
    );
  }
}

class List extends Component {
	
	constructor(props) {
		super(props);

		const data = new ListView.DataSource({rowHasChanged: () => false });
	    
	    const apiData = fetch("https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=d2353bad3ca84cb0a014d6984edad346&q=newyork")
	    .then((response) => response.json())
	    .then((responseJson) => {
	    	return responseJson;
	    })
	    .then((result) => {
	    	console.log(result);
	    	this.state = {
		      dataSource: data.cloneWithRows([JSON.stringify(result), "yay"]),
			}
	    }).catch((err) => {
	    	this.state = {
		      dataSource: data.cloneWithRows([err, "yay"]),
			}
	    });

	    this.state = {
	    	dataSource: data.cloneWithRows(apiData),
	    }

	    
	}

	render() {
		return (
	      <View style={{flex: 1, paddingTop: 22}}>
	        <ListView
	          dataSource={this.state.dataSource}
	          renderRow={(rowData) => <Text>{rowData}</Text>}
	        />
	      </View>
		)
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    padding: 30,
  },
});

AppRegistry.registerComponent('Example', () => Example);
