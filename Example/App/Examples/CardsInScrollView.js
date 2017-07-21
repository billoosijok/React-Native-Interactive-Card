import React from 'react';
import {StyleSheet, Text, ScrollView, View, Animated} from 'react-native';

import InteractiveCard, {Header, Content, DismissButton} from 'react-native-interactive-card';

export default class CardsInScrollView  extends React.Component {
	constructor() {
		super();
		this.state = {activeCard : null};

		this.layoutAnimationValue = new Animated.Value(0);
	}

	componentWillMount() {
		this.state.cards = [
			0,1,2,3,4,5,6,7,8,9,10,11,
			12,13,14,15,16,17,18,19,20
		].map((number, i) => {

			return (
				<InteractiveCard
					key={i}
					name={number}
					style={styles.cardStyles}
					openCoords={{y: 100, x: 5}}
					overlayOpacity={0.8}
					onActive={this.setActiveCard.bind(this)}
					onAnimationProgress={this.getAnimationProgress.bind(this)}
				>
					<Header style={styles.headerWrapper}>
						<View style={styles.cardHeader}>
							<View style={styles.leftColumn}>
								<View style={styles.image} />
							</View>
							<View style={styles.rightColumn}>
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
		});
	}

	setActiveCard(card) {
		Animated.timing(this.layoutAnimationValue, {
			toValue: (Boolean(card)) ? 1 : 0,
			duration: 200
		}).start();
		this.setState({activeCard: card});
	}

	getAnimationProgress(draggingProgress) {
		if (draggingProgress >= 0 && draggingProgress <= 1)
			this.layoutAnimationValue.setValue(draggingProgress);
	}

	getNavBarStyles() {
		return {
			height: this.layoutAnimationValue.interpolate({
				inputRange: [0, 1],
				outputRange: [80, 0]
			}),
			backgroundColor: "rgba(0,0,0,0.1)",
			alignItems: "center",
			justifyContent: "flex-end",
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<Animated.View style={this.getNavBarStyles()}>
					<View style={styles.navBar}/>
				</Animated.View>
				<ScrollView scrollEnabled={!Boolean(this.state.activeCard)}>
					{this.state.cards}
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	cardStyles: {
		flex: 1,
	},
	navBar: {
		backgroundColor: 'black',
		borderRadius: 10,
		opacity: 0.6,
		width: "80%",
		height: 30,
		marginBottom: 10
	},
	headerWrapper: {
		padding: 10,
		paddingBottom: 30
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
