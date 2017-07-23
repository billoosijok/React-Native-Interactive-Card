import React from 'react';
import {StyleSheet, Text, ScrollView, View, Animated} from 'react-native';

import CardsInScrollView from './App/CardsInScrollView'
import CardsInView from './App/Base'
import CustomTransition from './App/CustomTransition'

export default class App extends React.Component {

	loadCardsInView = () => <CardsInView />;
	loadCustomTransition = () => <CustomTransition />;
	loadCardsInScrollView = () => <CardsInScrollView />;

	render() {
		return (
			this.loadCardsInScrollView()
		);
	}
}

