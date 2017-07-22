import React from 'react';
import {StyleSheet, Text, ScrollView, View, Animated} from 'react-native';

import InteractiveCard, {Header, Content, DismissButton} from 'react-native-interactive-card';

export default class CardsInScrollView  extends React.Component {
	constructor() {
		super();
	}

	render() {
		return (
			<View style={styles.container}>
				<InteractiveCard>
					<Header style={styles.cardHeader}>
						<Text style={styles.text}>Header</Text>
					</Header>
					<Content style={styles.content}>
						<Text style={styles.text}>Content</Text>
					</Content>
				</InteractiveCard>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		justifyContent: 'center',
		padding: 10
	},
	cardHeader: {
		height: 100,
		backgroundColor: '#68E9FF',
	},
	text: {
		fontSize: 40,
		opacity: 0.6,
		textAlign: 'center',
		padding: 20,
		fontWeight: 'bold'
	},

	content: {
		height: 500,
		backgroundColor: '#E85F53',
		width: '100%',
		padding: 10
	},
});
