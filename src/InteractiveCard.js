// @flow

import React, { Component } from 'react'
import {
	Text,
	View,
	ScrollView,
	Animated,
	PanResponder,
	TouchableOpacity,
	LayoutAnimation,
	Dimensions
} from 'react-native'
import styles from './InteractiveCardStyle'

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
			right: 0
		};
		this.containerRequiredStyle = {position: 'relative', overflow: 'hidden'};

		this.overlayRequiredStyles = {
			position: 'absolute',
			backgroundColor: this.props.overlayColor || 'white',
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

		this.containerLayout = null;

		this.containerStyle = [props.style, this.containerRequiredStyle];

		this.headerAnimateVal = new Animated.Value(0);
		this.contentAnimateVal = new Animated.Value(0);
		this.overlayAnimateVal = new Animated.Value(0);

		this.instantVal = new Animated.Value(0);
	}

	// -- Component lifecycle methods -- //
	componentWillMount() {

		this.props.dimissButton.type.arguments = ["ya"]
		console.log(this.props.dimissButton);

		// Combining required styles with styles passed into 'style' prop
		this.state.contentStyles =
			(Array.isArray(this.content.props.style)) ?
				this.content.props.style.concat(this.contentRequiredStyles) : [].concat(this.content.props.style, this.contentRequiredStyles);

	}

	componentDidMount() {



		this.state.panResponder = PanResponder.create({
			onStartShouldSetPanResponder: () => this.state.isActive,
			onPanResponderGrant: () => {

			},
			onMoveShouldSetResponder: () => this.state.isActive,
			onPanResponderMove: (event, gestureState) => {

				const target = this.containerLayout.y + Math.abs(this.props.openCoords.y);
				const newAnimateVal = 1 - (gestureState.dy / target);

				if (newAnimateVal <= 1 && newAnimateVal >= 0) {
					Animated.timing(this.headerAnimateVal, {
						toValue: newAnimateVal,
						duration: 0,
						useNativeDriver: true,
					}).start();

					Animated.timing(this.contentAnimateVal, {
						toValue: newAnimateVal,
						duration: 0,
						useNativeDriver: true,
					}).start();

					Animated.timing(this.overlayAnimateVal, {
						toValue: newAnimateVal,
						duration: 0,
						useNativeDriver: true,
					}).start();
				} else if (newAnimateVal > 1 || newAnimateVal < -0) {
					Animated.timing(this.headerAnimateVal, {
						toValue: newAnimateVal * 0.05,
						duration: 0,
						useNativeDriver: true,
					}).start();

					Animated.timing(this.contentAnimateVal, {
						toValue: newAnimateVal * 0.05,
						duration: 0,
						useNativeDriver: true,
					}).start();

					Animated.timing(this.overlayAnimateVal, {
						toValue: newAnimateVal * 0.05,
						duration: 0,
						useNativeDriver: true,
					}).start();
				}
			},
			onPanResponderRelease: () => {
				if (this.headerAnimateVal._value > 0.5 || this.contentAnimateVal._value > 0.5) {
					this.open()
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

			// To notify parent that this card is active
			if (this.props.onActive)
				this.props.index ? this.props.onActive(this.props.index) : this.props.onActive(true)
		} else {
			this.close();

		}
	}

	_onDismissPress() {
		if (this.state.isActive) {
			this.close();
		}
	}

	_onLayout(event) {
		this.setState({layout: event.nativeEvent.layout})
	}

	_onContainerLayout(event) {
		this.containerLayout = event.nativeEvent.layout;

		this.containerStyle = [this.containerStyle, {height: this.containerLayout.height}];
	}


	/* -- Functions -- */
	open() {
		this.setState({ isActive: true });

		this.containerStyle = [].concat(this.props.style, this.containerRequiredStyle, {zIndex: 2, overflow: 'visible'});

		this.instantVal.setValue(1);

		Animated.spring(this.headerAnimateVal, {
			toValue: 1,
			useNativeDriver: true,
			speed: 10,
			bounciness: 8,
		}).start();

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
		this.setState({isActive: false});

		this.instantVal.setValue(0);

		Animated.spring(this.headerAnimateVal, {
			toValue: 0,
			useNativeDriver: true,
			speed: 10,
			bounciness: 8,
		}).start((status) => {
			if (status.finished) {
				this.containerStyle = [this.props.style, this.containerRequiredStyle, {zIndex: 0}];
				this.forceUpdate();
				if (this.props.onPress) {
					this.props.onPress(null)
				}
			}
		});

		Animated.spring(this.contentAnimateVal, {
			toValue: 0,
			useNativeDriver: true,
			speed: 20,
			bounciness: 10,
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

			const newCardWrapperY = -y + 20;

			let positionAnimatedStyles = {
				transform: [
					{ translateY: this.headerAnimateVal.interpolate({
						inputRange: [0, 1],
						outputRange: [0, newCardWrapperY]
					})}
				]
			};

			const wrapperAnimatableStyles = {
				...positionAnimatedStyles,
			};
			const contentAnimatableStyles = this.initContentAnimatableStyles(height);
			const overlayAnimatableStyles = this.initOverlayAnimatableStyles(x, y, width, height);

			this.setState({
				wrapperStyles: [].concat(this.wrapperRequiredStyles, wrapperAnimatableStyles),
				contentStyles: [].concat(this.content.props.style, this.contentRequiredStyles, contentAnimatableStyles),
				overlayStyles: [].concat(this.overlayRequiredStyles, overlayAnimatableStyles)
			}, callback);

		});
	}

	initContentAnimatableStyles(cardWrapperHeight) {

		return {
			transform: [
				{ translateY: this.contentAnimateVal.interpolate({
					inputRange: [0, 1],
					outputRange: [-100, cardWrapperHeight-20]
				})}
			],
			opacity: this.contentAnimateVal.interpolate({
				inputRange: [0, 1],
				outputRange: [0, 1]
			})
		};
	}

	initOverlayAnimatableStyles(containerX, containerY, containerWidth, containerHeight) {

		const windowDimensions = Dimensions.get('window');

		const containerYCenter = containerY + (containerHeight / 2);
		const overlayScaleY = windowDimensions.height/ containerHeight; // 0.5 for margin
		const newHeight = containerHeight * overlayScaleY;

		let overlayDeadCenter = containerYCenter - (windowDimensions.height / 2) + containerHeight / 2;
		overlayDeadCenter = -overlayDeadCenter/overlayScaleY+11;
		// console.log(overlayDeadCenter/overlayScaleY);
		return {

			transform : [
				// { scaleX: this.overlayAnimateVal.interpolate({
				// 	inputRange: [0, 1],
				// 	outputRange: [1, 2]
				// })},
				{ scaleY: this.overlayAnimateVal.interpolate({
					inputRange: [0, 0.1, 1],
					outputRange: [1, overlayScaleY, overlayScaleY]
				})},
				// { translateX: this.overlayAnimateVal.interpolate({
				// 	inputRange: [0, 1],
				// 	outputRange: [0, containerX]
				// })},
				{ translateY: this.overlayAnimateVal.interpolate({
					inputRange: [0, 0.1, 1],
					outputRange: [0, overlayDeadCenter, overlayDeadCenter]
				})}
			],
			opacity: this.overlayAnimateVal.interpolate({
				inputRange: [0, 1],
				outputRange: [0, this.props.overlayOpacity || 0.8]
			})

		}

	}

	getDismissIconAnimatableStyles() {
		return {
			opacity: this.contentAnimateVal.interpolate({
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
		// console.log("Rendering " + this.props.name);
		return (
		    <TouchableOpacity
			    ref={this.setRef.bind(this,"_containerOfAll")}
			    onPress={this._onPress.bind(this)}
			    onLayout={this._onContainerLayout.bind(this)}
			    style={this.containerStyle}
			    activeOpacity={(this.state.isActive ? 1.0 : 0.5)}
		        disabled={this.state.isActive}>

			    <Animated.View style={this.state.overlayStyles}/>
			    <Animated.View style={this.state.wrapperStyles}  >
				    <Header ref="head" style={this.header.props.style} panHandlers={this.state.panResponder.panHandlers}>
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
		    <Animated.View style={this.props.style}>
			    { this.props.children }
		    </Animated.View>
		)
	}
}

export class DismissButton extends Component {
	getImage() {
		if (this.props.imageSource) {
			return this.props.imageSource;
		} else {
			return ("./assets/dismissBlue.png");
		}
	}
	render() {
		return (
		    <TouchableOpacity onPress={(this._onDismissPress) ? this._onDismissPress.bind(this) : undefined}
		                      style={[styles.dismissButton]}>
			    {/*<Animated.Image source={"./assets/dismissBlue.png"}*/}
			                    {/*resizeMode={'contain'}/>*/}
			                    <Text>{this.props.text || "yay"}</Text>
		    </TouchableOpacity>
		)
	}
}

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