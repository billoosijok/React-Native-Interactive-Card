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
		flex: 1,
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	dismissIcon: {
		opacity: 0,
		maxWidth: '70%',
		height: '50%',
	},
	visibleDismissIcon: {
		opacity: 1,
	},
	contentStyles: {
		flex: 0,
		height: 0,
		overflow: 'hidden',
		zIndex: 1,
		marginLeft: 3,
		marginRight: 3,
		borderRadius: 5,
		alignItems: 'center'
	},
	contentScrollView: {
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 20,
	},
	contentText: {
		fontSize: 30,
		fontWeight: 'bold',
		textAlign: 'center',
		padding: 10,
		opacity: 0.7,
		width: 300,
	}
})
