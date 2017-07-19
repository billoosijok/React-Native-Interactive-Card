import React from 'react';
import {StyleSheet, Text, ScrollView, View} from 'react-native';

import InteractiveCard, {Header, Content, DismissButton} from './src/InteractiveCard';

export default class App extends React.Component {
	constructor() {
		super();
		this.state = {activeCard : true}

		this.stuff = [
			{}
		];

		this.cards = [1,2,3,4,5,6,7,8].map((number, i) => {

			const dismissButton = (<DismissButton key={i} yes="true" />)
			return (
				<InteractiveCard
					key={i}
					name={number}
					style={styles.cardStyles}
					openCoords={{y: 5, x: 5, height: 260, width: 300}}
					overlayOpacity={0.7}
				    dimissButton={dismissButton}
				>
					<Header style={styles.headerWrapper}>
						<View style={styles.cardHeader}>
							<View style={styles.leftColumn}>
								<View style={styles.image} />
							</View>
							<View style={styles.rightColumn}>
								{dismissButton}
								<View style={styles.heading} />
								<View style={styles.subheading} />
							</View>
						</View>
					</Header>
					<Content style={styles.contentWrapper}>
						<ScrollView style={styles.content}>
							<Text style={styles.contentText}>{number}</Text>
						</ScrollView>
					</Content>
				</InteractiveCard>
			)
		})
	}
	render() {
		return (
			<ScrollView scrollEnabled={false} style={styles.container}>
				{this.cards}
			</ScrollView>
		);
	}
}

const cardHeight = 102.44;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		paddingTop: 30
	},
	cardStyles: {
		flex: 1,
	},
	headerWrapper: {
		padding: 10
	},
	cardHeader: {
		height: 100,
		backgroundColor: '#68E9FF',
		flexDirection: 'row',
		borderRadius: 5,
		shadowOffset: {width: 0, height: 2},
		shadowRadius: 1,
		shadowOpacity: 0.2,
		shadowColor: 'black'
	},
	leftColumn: {
		flex: 1,
		padding: 10,
	},
	rightColumn: {
		flex: 3,
		padding: 10,

	},
	image: {
		width: "100%",
		height: "100%",
		backgroundColor: "#FF9E0D",
		borderRadius: 50,
		shadowOffset: {width: 0, height: 2},
		shadowRadius: 2,
		shadowOpacity: 0.2,
		shadowColor: 'black'
	},
	heading: {
		backgroundColor: '#666',
		width: 200,
		height: 30,
		marginBottom: 10,
		borderRadius: 10
	},
	subheading: {
		backgroundColor: '#888',
		width: 100,
		height: 20,
		borderRadius: 7
	},
	contentWrapper:{
		alignItems: 'center'
	},
	content: {
		height: 500,
		backgroundColor: '#E85F53',
		width: '92%',
		marginTop: -20,
		paddingTop: 30,
		borderRadius: 3,
		padding: 10
	},
	contentText: {
		fontSize: 30,
		textAlign: 'center',
		fontWeight: 'bold',
	}
});
