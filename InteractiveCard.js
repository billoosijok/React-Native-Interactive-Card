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

		this.wrapperStyles = {borderWidth: 1};
		this.state = {
			isActive: false,
			wrapperStyles: this.wrapperStyles
		};
		this.state.panResponder = { panHandlers: null };

		this.containerLayout = null;

		this.header = this.props.children[0];
		this.content = this.props.children[1];

		// These are needed since they will be animated later on
		this.containerStyle = [props.style, {position: 'relative'}];

		this.positionAnimateVal = new Animated.Value(0);
		this.dimensionsAnimateVal = new Animated.Value(0);
		this.instantVal = new Animated.Value(0);
	}

	// -- Component lifecycle methods -- //
	componentWillMount() {

		const newContentStyles = {
			opacity: 1,
			transform: [
				// { scaleY: 0.1 }
			],
		};
		const contentStyle =
			(Array.isArray(this.content.props.style)) ?
				this.props.style.concat(newContentStyles) : [].concat(this.content.props.style, newContentStyles);

		this.content = (<Content {...this.content.props} style={contentStyle} />)

	}

	componentDidMount() {

		this.state.panResponder = PanResponder.create({
			onMoveShouldSetResponder: () => this.state.isActive,
			onPanResponderMove: (event, gestureState) => {

				const target = this.state.containerLayout.y + Math.abs(this.props.openCoords.y);
				const newAnimateVal = 1 - (gestureState.dy / target);

				if (newAnimateVal <= 1 && newAnimateVal >= 0) {
					Animated.spring(this.positionAnimateVal, {
						toValue: newAnimateVal
					}).start();

					Animated.spring(this.dimensionsAnimateVal, {
						toValue: newAnimateVal
					}).start();
				} else if (newAnimateVal <= 1.1 && newAnimateVal >= -0.1) {
					Animated.spring(this.positionAnimateVal, {
						toValue: newAnimateVal * 0.05
					}).start();

					Animated.spring(this.dimensionsAnimateVal, {
						toValue: newAnimateVal * 0.05
					}).start();
				}
			},
			onPanResponderRelease: () => {
				if (this.positionAnimateVal._value > 0.5 || this.dimensionsAnimateVal._value > 0.5) {
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
			this.open();

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
		this.initCardWrapperAnimatableStyles(this.containerLayout)
	}


	/* -- Functions -- */
	open() {
		this.setState({ isActive: true });

		this.containerStyle = [this.props.style, {zIndex: 2, position: 'relative'}];

		this.instantVal.setValue(1);

		// Animated.timing(this.dimensionsAnimateVal, {
		// 	toValue: 1,
		// 	duration: 300,
		// 	delay: 100
		// }).start();
		//
		// Animated.spring(this.positionAnimateVal, {
		// 	toValue: 1,
		// 	speed: 10,
		// 	bounciness: 10
		// }).start();
	}

	close() {
		this.setState({isActive: false});

		this.instantVal.setValue(0);

		// Animated.spring(this.positionAnimateVal, {
		// 	toValue: 0,
		// 	speed: 20,
		// 	bounciness: 10,
		// 	delay: 200
		// }).start();
		//
		// Animated.timing(this.dimensionsAnimateVal, {
		// 	toValue: 0,
		// 	duration: 400
		// }).start((status) => {
		// 	if (status.finished) {
		// 		this.containerStyle = [this.props.style];
		// 		if (this.props.onPress) {
		// 			this.props.onPress(null)
		// 		}
		// 	}
		// });
	}

	// -- Helper functions -- //
	initCardWrapperAnimatableStyles(containerLayout) {
		const windowDimensions = Dimensions.get('window');

		let dimensionsAnimatedStyles = getAnimatableStyles(this.dimensionsAnimateVal, {
			shadowOpacity: { from: 0, to: 0.3 },
			shadowRadius: { from: 0.5, to: 7 },
		});

		let instantChangeStyes = getAnimatableStyles(this.instantVal, {
			top: { from: 0, to: 0 - containerLayout.y },
			left: { from: 0, to: 0 - containerLayout.x},
			width: { from: containerLayout.width, to: windowDimensions.width },
			height: { from: containerLayout.height, to: windowDimensions.height	},
		});

		const animatableStyles = {
			position: 'absolute',
			backgroundColor: 'grey',
			...instantChangeStyes,
			...dimensionsAnimatedStyles
		};

		this.setState({wrapperStyles: [].concat(this.state.wrapperStyles, animatableStyles)})
	}

	getContentAnimatableStyles(openCoords) {

		let dimensionsAnimation = getAnimatableStyles(this.dimensionsAnimateVal, {
			flex: {input: [0, 0.3, 1], output: [0, 0, 6]},
			opacity: {input: [0, 0.6, 1], output: [0, 1, 1]},
			paddingTop: {from: -30, to: 0}
		});

		return {
			...dimensionsAnimation,
			transform: [
				{
					translateY: this.positionAnimateVal.interpolate({
						inputRange: [0, 1],
						outputRange: [-80, -10]
					})
				}
			]
		}
	}

	getDismissIconAnimatableStyles() {
		return {
			opacity: this.dimensionsAnimateVal.interpolate({
				inputRange: [0, 1],
				outputRange: [0, 1]
			}),
		}
	}

	render() {
		console.log("Rendering " + this.props.name);
		return (
		    <TouchableOpacity onPress={this._onPress.bind(this)} onLayout={this._onContainerLayout.bind(this)} style={this.containerStyle} activeOpacity={(this.state.isActive ? 1.0 : 0.5)}>
			    <Animated.View style={this.state.wrapperStyles}>
				    { this.header }
			    </Animated.View>
		    </TouchableOpacity>
		)
	}
}

export class Header extends Component {

	render() {
		return (
		    <View style={this.props.style}>
			    { this.props.children }
		    </View>
		)
	}
}

export class Content extends Component {

	render() {
		return (
		    <View style={this.props.style}>
			    { this.props.children }
		    </View>
		)
	}
}

export class DismissButton extends Component {
	render() {
		return (
		    <TouchableOpacity onPress={this._onDismissPress.bind(this)} disabled={!this.state.isActive}
		                      style={[styles.dismissButton]}>
			    <Animated.Image source={this.props.imageSource} style={dismissIconStylesToRender}
			                    resizeMode={'contain'}/>
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