// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
	Text,
	View,
	ScrollView,
	Animated,
	PanResponder,
	TouchableOpacity,
	LayoutAnimation,
	Dimensions,
	TouchableWithoutFeedback
} from 'react-native'
import styles from './InteractiveCardStyle'

// Making custom animatable components
Animated.TouchableWithoutFeedback = Animated.createAnimatedComponent(TouchableWithoutFeedback);

export default class InteractiveCard extends Component {

	constructor(props) {
		super(props);

		this.header = this.props.children[0];
		this.content = this.props.children[1];
		this.dismissButton = this.findDismissButton();

		// These are needed since they will be animated later on
		this.wrapperRequiredStyles = {position: 'relative'};
		this.contentRequiredStyles = {
			opacity: 0,
			position: 'absolute',
			zIndex: -1,
			left: 0,
			right: 0,
			// that way it's not touchable when it's not shown
			transform: [{scaleY: 0}]
		};
		this.containerRequiredStyle = {position: 'relative'};

		this.overlayRequiredStyles = {
			position: 'absolute',
			backgroundColor: this.props.overlayColor,
			opacity: 0,
			height: "100%",
			width: "100%"
		};

		this.state = {
			isActive: false,
			header: null,
			wrapperStyles: this.wrapperRequiredStyles,
			contentStyles: this.contentRequiredStyles,
			overlayStyles: this.overlayRequiredStyles,
			panResponder: { panHandlers: null }
		};

		this.containerLayoutInWindow = null;

		this.containerStyle = [props.style, this.containerRequiredStyle];

		this.headerAnimateVal = new Animated.Value(0);
		this.contentAnimateVal = new Animated.Value(0);
		this.overlayAnimateVal = new Animated.Value(0);

		this.instantVal = new Animated.Value(0);
	}

	// -- Component lifecycle methods -- //
	componentWillMount() {
		console.log("Rendering " + this.props.name);

		// yay
		// Combining required styles with styles passed into 'style' prop
		// this.state.contentStyles =
		// 	(Array.isArray(this.content.props.style)) ?
		// 		this.content.props.style.concat(this.contentRequiredStyles) : [].concat(this.content.props.style, this.contentRequiredStyles);

	}

	componentDidMount() {
		this.state.panResponder = PanResponder.create({

			onStartShouldSetPanResponder: () => this.state.isActive,
			onPanResponderGrant: () => {

			},
			onMoveShouldSetResponder: () => this.state.isActive,
			onPanResponderMove: (event, gestureState) => {

				// If there are openCoords (the coordinated of where the card should open in). We add that
				// to the original Y position of the card. Then we can get the Y target of the card
				const numberToFactor = (this.props.openCoords && this.props.openCoords.y) ? Math.abs(this.props.openCoords.y) : 20;

				const target = this.containerLayoutInWindow.y + numberToFactor;
				let newAnimateVal = 1 - (gestureState.dy / target);

				if (this.props.onDraggingProgress) { this.props.onDraggingProgress(newAnimateVal) }

				// If it's more than 1 or less than 0 we decrease the animation rate. ie add friction
				if (newAnimateVal > 1.05) newAnimateVal = 1 + newAnimateVal * 0.05;
				if (newAnimateVal <= 0) newAnimateVal = newAnimateVal * 0.05;

				this.headerAnimateVal.setValue(newAnimateVal);
				this.contentAnimateVal.setValue(newAnimateVal);
				this.overlayAnimateVal.setValue(newAnimateVal);

			},
			onPanResponderRelease: () => {

				if (this.headerAnimateVal._value > 0.5 || this.contentAnimateVal._value > 0.5) {
					this.open();

				} else {
					this.close()
				}
			}
		});

	}


	/* -- Event Handlers -- */
	_onPress() {
		if (!this.state.isActive) {
			this.initCardWrapperAnimatableStyles(this.open);

		}
	}

	_onDismissPress() {
		if (this.state.isActive) {
			this.close();
		}
	}

	/* -- Functions -- */
	open() {

		// To avoid re-rendering
		if (!this.state.isActive) {
			this.setState({ isActive: true });

			if(this.props.onOpen) this.props.onOpen(this);

		}


		this.containerStyle = [].concat(this.props.style, this.containerRequiredStyle, {zIndex: 2, overflow: 'visible'});

		this.instantVal.setValue(1);

		Animated.spring(this.headerAnimateVal, {
			toValue: 1,
			useNativeDriver: true,
			speed: 10,
			bounciness: 8,
		}).start();

		if(this.props.onAnimationProgress)
			this.headerAnimateVal.addListener((obj) => this.props.onAnimationProgress(obj.value));


		Animated.spring(this.contentAnimateVal, {
			toValue: 1,
			useNativeDriver: true,
			speed: 20,
			bounciness: 1,
			delay: 200,
		}).start();

		Animated.timing(this.overlayAnimateVal, {
			toValue: 1,
			duration: 100,
			useNativeDriver: true,

		}).start();
	}

	close() {

		if(this.props.onClose) this.props.onClose(this);

		this.instantVal.setValue(0);

		Animated.spring(this.headerAnimateVal, {
			toValue: 0,
			useNativeDriver: true,
			speed: 10,
			bounciness: 8

		}).start((status) => {
			if (status.finished) {
				this.containerStyle = [this.props.style, this.containerRequiredStyle, {zIndex: 0}];
				this.setState({isActive: false});

				if (this.props.onPress) {
					this.props.onPress(null)
				}

				this.headerAnimateVal.removeAllListeners();
			}
		});

		Animated.timing(this.contentAnimateVal, {
			toValue: 0,
			useNativeDriver: true,
			duration: 200,

		}).start();

		Animated.timing(this.overlayAnimateVal, {
			toValue: 0,
			duration: 100,
			useNativeDriver: true,

		}).start();
	}

	// -- Helper functions -- //
	initCardWrapperAnimatableStyles(callback) {

		callback = callback || function() {};

		this._containerOfAll.measureInWindow((x, y, width, height) => {

			// This will be used for the dismissal pan gesture
			this.containerLayoutInWindow = {x,y,width,height};

			// If the `Y` is null. That means it was explicitly declared so that the card doesn't move on the 'Y' axis
			// so only then we make the amount of movement 0. Because if the 'Y' was left out, we still move the card up
			// with a default value of 20. The reason behind that is that for those who will use the component without
			// explicitly declaring the 'Y' prop, they still get the jumping card by default. That way they'd think
			// it's cool.
			//
			// For the `X`, however, we make the amount of movement 0 if it was null or even undefined (it was left out).
			let numberToFactorForY = (this.props.openCoords.y !== null) ? this.props.openCoords.y : 0;
			const numberToFactorForX = (this.props.openCoords.x) ? this.props.openCoords.x : 0;

			if(numberToFactorForY === undefined) numberToFactorForY = 20;

			const newCardWrapperY = -y + numberToFactorForY;
			let newCardWrapperX;

			if (numberToFactorForX === "center")
				newCardWrapperX = -x + Dimensions.get('window').width/2 - width/2;
			else
				newCardWrapperX = -x + numberToFactorForX;

			let transformsToPerform = [];

			if (this.props.openCoords.y !== null) {

				const translateY = { translateY: this.headerAnimateVal.interpolate({
					inputRange: [0, 1],
					outputRange: [0, newCardWrapperY]
				})};
				transformsToPerform.push(translateY);
			}

			if (this.props.openCoords.x !== null && this.props.openCoords.x !== undefined) {
				const translateX = { translateX: this.headerAnimateVal.interpolate({
					inputRange: [0, 1],
					outputRange: [0, newCardWrapperX]
				})};
				transformsToPerform.push(translateX);
			}

			let positionAnimatedStyles = {
				transform: transformsToPerform
			};

			const wrapperAnimatableStyles = {
				...positionAnimatedStyles,
			};
			const contentAnimatableStyles = this.initContentAnimatableStyles(height, width);
			const overlayAnimatableStyles = this.initOverlayAnimatableStyles(x, y, width, height);

			this.setState({
				wrapperStyles: [].concat(this.wrapperRequiredStyles, wrapperAnimatableStyles),
				contentStyles: [].concat(this.content.props.style, this.contentRequiredStyles, contentAnimatableStyles),
				overlayStyles: [].concat(this.overlayRequiredStyles, overlayAnimatableStyles)
			}, callback);

		});
	}

	initContentAnimatableStyles(cardWrapperHeight, cardWrapperWidth) {

		const direction = this.content.props.enterFrom;
		const window = Dimensions.get('window');

		let translateX = null;

		let translateY = {
			translateY: this.contentAnimateVal.interpolate({
				inputRange: [0, 1],
				outputRange: [-cardWrapperHeight, cardWrapperHeight-20]
			})
		};

		let factor = 1;
		switch(direction) {
			case "top":
			case "bottom":
				if(direction === "top") factor = -1;
				translateY = { translateY: this.contentAnimateVal.interpolate({
						inputRange: [0, 1],
						outputRange: [window.height*factor*3, cardWrapperHeight-20]
					})
				};
				break;
			case "left":
			case "right":
				if(direction === "left") factor = -1;
				translateX = {
					translateX: this.contentAnimateVal.interpolate({
						inputRange: [0, 1],
						outputRange: [window.width*factor, 0]
					})
				};
				break;
			default:
				break;
		}

		let transform = [
			{ scaleY: this.contentAnimateVal.interpolate({
				inputRange: [0, 1],
				outputRange: [0, 1]
			})},
			translateY
		];

		if (translateX) transform.push(translateX);

		return {
			transform,
			opacity: this.contentAnimateVal.interpolate({
				inputRange: [0, 0.3, 1],
				outputRange: [0, 0, 1]
			})
		};

	}

	initOverlayAnimatableStyles(containerX, containerY, containerWidth, containerHeight) {
		// NEEDS REVISION

		const windowDimensions = Dimensions.get('window');
		const overlayOpacity = (!isNaN(Number(this.props.overlayOpacity))) ? {from: 0, to: this.props.overlayOpacity} : this.props.overlayOpacity;

		// X axis
		const containerXCenter = containerX + (containerWidth / 2);
		const overlayScaleX = windowDimensions.width/ containerWidth + 4; // 4 for margin
		const newWidth = containerWidth * overlayScaleX;

		let overlayXDeadCenter = containerXCenter - (windowDimensions.width / 2) + containerWidth/ 2;
		overlayXDeadCenter = -overlayXDeadCenter/overlayScaleX/30;

		// Y  axis
		const containerYCenter = containerY + (containerHeight / 2);
		const overlayScaleY = windowDimensions.height/ containerHeight + 4; // 4 for margin
		const newHeight = containerHeight * overlayScaleY;

		let overlayYDeadCenter = containerYCenter - (windowDimensions.height / 2) + containerHeight / 2;
		overlayYDeadCenter = -overlayYDeadCenter/overlayScaleY/30;


		return {
			transform : [
				{ scaleX: this.overlayAnimateVal.interpolate({
					inputRange: [0, 0.1, 1],
					outputRange: [1, overlayScaleX, overlayScaleX]
				})},
				{ scaleY: this.overlayAnimateVal.interpolate({
					inputRange: [0, 0.1, 1],
					outputRange: [1, overlayScaleY, overlayScaleY]
				})},
				{ translateX: this.overlayAnimateVal.interpolate({
					inputRange: [0, 0.1, 1],
					outputRange: [0, overlayXDeadCenter, overlayXDeadCenter]
				})},
				{ translateY: this.overlayAnimateVal.interpolate({
					inputRange: [0, 0.1, 1],
					outputRange: [0, overlayYDeadCenter, overlayYDeadCenter]
				})}
			],
			opacity: this.overlayAnimateVal.interpolate({
				inputRange: [0, 0.05, 1],
				outputRange: [0, overlayOpacity.from || 0, overlayOpacity.to || 0.8]
			})

		}
	}

	initDismissIconAnimatableStyles() {
		return {
			opacity: this.headerAnimateVal.interpolate({
				inputRange: [0, 1],
				outputRange: [0, 1]
			}),
		}
	}

	findDismissButton() {
		return findChildComponent(this.props.children, "DismissButton");
	}

	setRef(refName, component) {
		this[refName] = component
	}

	render() {
		return (
		    <TouchableOpacity
			    onLayout={this.props.onLayout}
			    ref={this.setRef.bind(this,"_containerOfAll")}
			    onPress={this._onPress.bind(this)}
			    style={this.containerStyle}
			    activeOpacity={(this.state.isActive ? 1.0 : 0.5)}
		        disabled={this.state.isActive}>

			    <TouchableWithoutFeedback onPress={this.close.bind(this)}>
				    <Animated.View style={this.state.overlayStyles}/>
			    </TouchableWithoutFeedback>
			    <Animated.View style={this.state.wrapperStyles}>
				    <Header style={this.header.props.style} panHandlers={this.state.panResponder.panHandlers}>
					    {this.header.props.children}
				    </Header>
				    <Content style={this.state.contentStyles}>
					    {this.content.props.children}
				    </Content>
			    </Animated.View>
		    </TouchableOpacity>
		)
	}
}

export class Header extends Component {

	render() {
		return (
		    <View {...this.props.panHandlers} style={this.props.style}>
			    { this.props.children }
		    </View>
		)
	}
}

export class Content extends Component {

	render() {
		return (
		    <Animated.View style={[{alignItems: 'center'}, this.props.style]}>
			    { this.props.children }
		    </Animated.View>
		)
	}
}

export class DismissButton extends Component {
	constructor() {
		super();

		this.state = {
			card : null
		};
		console.log(this);

	}
	setCard(card) {
		this.state.card = card
	}
	getImage() {
		if (this.props.imageSource) {
			return this.props.imageSource;
		} else {
			return require("./assets/dismissBlue.png");
		}
	}

	render() {
		return (
		    <TouchableOpacity onPress={this.props.onPress}
		                      style={[styles.dismissButton, this.props.style]}>
			    <Animated.Image source={this.getImage()}
			                    resizeMode={'contain'}/>
		    </TouchableOpacity>
		)
	}
}

InteractiveCard.propTypes = {
	openCoords: PropTypes.object,
	overlayOpacity: PropTypes.oneOfType([PropTypes.number,PropTypes.object]),
	overlayColor: PropTypes.string,
	onOpen: PropTypes.func,
	onClose: PropTypes.func,
	onDraggingProgress: PropTypes.func,
	onAnimationProgress: PropTypes.func,
	onLayout: PropTypes.func,
	children: function(prop, propName) {
		const children = prop[propName];
		const numberOfChildren = React.Children.count(children);
		if (numberOfChildren !== 2) {
			const whatWeGot = (numberOfChildren !== 1) ?  + `'${numberOfChildren}' are given ` : "only '1' is given ";
			const message = `Exactly 2 child components are expected inside \`InteractiveCard\` component, but ${whatWeGot}. It is recommended that you use the 'Header' and 'Content' components as the children for readability.`;

			console.error(message);
			return new Error(message)
		}
	}
};

InteractiveCard.defaultProps = {
	openCoords: {y: 20, x: null},
	overlayOpacity: 0.8,
	overlayColor: "white",
};

Content.propTypes = {
	enterFrom: PropTypes.oneOf(['bottom', 'top', 'right', 'left', 'none'])
};

Content.defaultProps = {
	enterFrom: "top"
};


function getAnimatableStyles(interpolationValue, styles) {

	let animatedStyles = {};

	for (prop in styles) {

		if (styles.hasOwnProperty(prop)) {
			const style = styles[prop];

			let styleInputRange;
			let styleOutputRange;

			// if (!style.animateVal) throw new Error("No 'animateVal' property provided for '"+ prop +"'");

			if (style.from !== undefined && style.to !== undefined) {
				styleInputRange = [0, 1];
				styleOutputRange = [style.from, style.to];

			} else if (style.input !== undefined && style.output !== undefined) {
				styleInputRange = style.input;
				styleOutputRange = style.output;

			} else {
				throw new Error("Invalid keys supplied to '" + prop + "'. Valid keys are '(from & to) or (input & output)")
			}

			animatedStyles[prop] = interpolationValue.interpolate({
				inputRange: styleInputRange,
				outputRange: styleOutputRange
			})
		}
	}

	return animatedStyles;
}

/*
* Returns the first instance of the component with matching childComponentName
* */
function findChildComponent(children, childComponentName) {

	// Only doing this because if there is only one child,
	// it comes in as an object. Therefore, we put it into an array
	// to be able to use the same loop
	children = (children.length) ? children : [children];

	for (let i = 0; i < children.length; i++) {
		const node = children[i];


		// Checking if it has children
		if (node.type && (node.type.name === childComponentName
			|| node.type.displayName === childComponentName)) {
			// children. = undef;
			return node;
		}

		if (node.props && node.props.children) {
			let nodeFound = findChildComponent(node.props.children, childComponentName);

			if (nodeFound) {
				return nodeFound;
			}
		}

	}

	// If nothing was found above
	return undefined;

}