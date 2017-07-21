import {StyleSheet} from 'react-native'
//import {Fonts, Colors, Metrics} from '../../Themes'

const cardHeight = 102.44;

const openCardShadowRadius = 10;
const closedCardShadowRadius = 2;
const borderRadius = 5;

export default  StyleSheet.create({
	container: {
		// position: 'relative',
	},
	containerOpen: {
		zIndex: 2,
	},
	cardGeneral: {
		// flex: 1,
		backgroundColor: 'transparent',
		alignItems: 'stretch',
		overflow: 'visible',
		shadowOffset: {width: 0, height: 0},
		shadowColor: 'black',
		shadowRadius: 0.3,
		shadowOpacity: 0.3,
		borderRadius: borderRadius
	},
	cardClosed: {
		height: cardHeight,
	},
	cardOpen: {
		position: 'absolute',
		top: -80,
		height: 800,//Metrics.screenHeight,
		zIndex: -10,
	},
	headerStyle: {
		flex: 1,
		flexDirection: 'row',
		position: 'relative',
		zIndex: 100,
		borderRadius: borderRadius,
		shadowOffset: {width: 0, height: 0},
		shadowColor: 'black',
		shadowRadius: closedCardShadowRadius,
		shadowOpacity: 0.2,
		backgroundColor: "grey"
	},
	dismissButton: {
		position: "absolute",
		right: 0,
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	dismissIcon: {
		opacity: 0,
		maxWidth: 70,
		height: '50%',
	},
})
