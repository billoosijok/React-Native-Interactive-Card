import React from 'react';
import {StyleSheet, Text, ScrollView, View, Animated, Dimensions} from 'react-native';

import InteractiveCard, {Header, Content} from 'react-native-interactive-card';

const windowDimensions = Dimensions.get('window');
const cardWidth = (windowDimensions.width < 768) ? "100%" : "50%";

export default class CardsInScrollView  extends React.Component {
	constructor() {
		super();
		this.state = {activeCard : null};

		this.layoutAnimationValue = new Animated.Value(0);
	}

	componentWillMount() {
		this.loadCards()
	}

	loadCards() {

		this.state.cards = [0,1,2,3,4,5, 6, 7, 8, 9, 10].map((number, i) => {

			return (
				<InteractiveCard
					key={i}
					name={number}
					style={styles.cardStyles}
					// On iPhone we open the card at 100 in the Y axis. But in iPad we leave it as is.
					openCoords={{y: 100, x: "center"}}
					onOpen={this.handleCardOpen.bind(this)}
					onClose={this.handleCardClose.bind(this)}
					onAnimationProgress={this.onAnimationProgress.bind(this)}
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
					<Content enterFrom={"bottom"} style={styles.contentWrapper}>
						<ScrollView style={styles.content}>
							<Text style={styles.contentText}>{"🤘"}</Text>
						</ScrollView>
					</Content>
				</InteractiveCard>
			)
		});
	}

	onAnimationProgress(draggingProgress) {
		if (draggingProgress >= 0 && draggingProgress <= 1)
			this.layoutAnimationValue.setValue(draggingProgress);
	}

	handleCardOpen(card) {
		Animated.timing(this.layoutAnimationValue, {
			toValue: 1,
			duration: 200
		}).start();
		this.setState({activeCard: card});
	}

	handleCardClose() {
		Animated.timing(this.layoutAnimationValue, {
			toValue: 0,
			duration: 200
		}).start();
		this.setState({activeCard: null});
	}

	getDraggingProgress() {

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
					<View style={styles.navItem}/>
				</Animated.View>
				<ScrollView contentContainerStyle={styles.scrollViewConentContainer} style={styles.scrollView} scrollEnabled={!Boolean(this.state.activeCard)}>
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
	scrollView: {
		flex: 1,
	},
	scrollViewConentContainer: {
		flexWrap: 'wrap',
		flexDirection: 'row',

	},
	cardStyles: {
		width: cardWidth,
	},
	navItem: {
		backgroundColor: 'black',
		borderRadius: 10,
		opacity: 0.4,
		width: "80%",
		height: 30,
		marginBottom: 13
	},
	headerWrapper: {
		padding: 10,
		paddingBottom: 30
	},
	cardHeader: {
		height: 100,
		backgroundColor: '#11C5FF',
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
		width: "70%",
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
		fontSize: 50,
		textAlign: 'center',
		fontWeight: 'bold',
	}
});
