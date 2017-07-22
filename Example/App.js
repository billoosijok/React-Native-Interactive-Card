import React from 'react';
import {StyleSheet, Text, ScrollView, View, Animated} from 'react-native';

import CardsInScrollView from './App/CardsInScrollView'
import CardsInView from './App/Base'
import CoolTransition from './App/CoolTransition'

export default class App extends React.Component {

	loadCardsInView = () => <CardsInView />;
	loadCoolTransition = () => <CoolTransition />;
	loadCardsInScrollView = () => <CardsInScrollView />;

	render() {
		return (
			this.loadCardsInScrollView()
		);
	}
}

