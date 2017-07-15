// @flow

import React, { Component } from 'react'
import {
	Text,
	View,
	Animated,
	PanResponder,
	TouchableOpacity,
	LayoutAnimation,
} from 'react-native'
import styles from './InteractiveCardStyle'

export default class InteractiveCard extends Component {

	constructor() {
		super();

		this.state = { isActive: false };
		this.state.containerLayout = null;
		this.state.panResponder = {
			panHandlers: null
		};

		// These are needed since they will be animated later on
		this.containerStyle = styles.container;
		this.cardStyle = styles.cardClosed;
		this.contentStyle = styles.contentStyles;
		this.dismissIconStyle = styles.dismissIcon;

		this.positionAnimateVal = new Animated.Value(0);
		this.dimensionsAnimateVal = new Animated.Value(0);
	}

	// -- Component lifecycle methods -- //
	componentWillMount() {

		this.state.panResponder = PanResponder.create({
			onStartShouldSetPanResponder: () => this.state.isActive,
			onPanResponderGrant: () => {

			},
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

	componentDidMount() {
		setTimeout(() => {
			// These are the animatable components. So we apply the animatable styles
			this.cardStyle = this.getCardAnimatableStyles();
			this.contentStyle = [this.contentStyle, this.getContentAnimatableStyles()];
			this.dismissIconStyle = [this.dismissIconStyle, this.getDismissIconAnimatableStyles()]

		}, 500)
	}


	/* -- Event Handlers -- */
	_onPress() {
		if (!this.state.isActive) {
			this.open();

			// To notify parent that this card is active
			if (this.props.onPress)
				this.props.index ? this.props.onPress(this.props.index) : this.props.onPress(true)
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
		this.setState({containerLayout: event.nativeEvent.layout})
	}

	/* -- Functions -- */
	open() {
		this.setState({ isActive: true });

		this.containerStyle = [styles.container, styles.containerOpen];

		Animated.timing(this.dimensionsAnimateVal, {
			toValue: 1,
			duration: 300,
			delay: 100
		}).start();

		Animated.spring(this.positionAnimateVal, {
			toValue: 1,
			speed: 10,
			bounciness: 10
		}).start();
	}

	close() {
		this.setState({isActive: false});

		Animated.spring(this.positionAnimateVal, {
			toValue: 0,
			speed: 20,
			bounciness: 10,
			delay: 200
		}).start();

		Animated.timing(this.dimensionsAnimateVal, {
			toValue: 0,
			duration: 400
		}).start((status) => {
			if (status.finished) {
				this.containerStyle = [styles.container];
				if (this.props.onPress) {
					this.props.onPress(null)
				}
			}
		});
	}

	// -- Helper functions -- //
	getAppropriateContainerStyles() {
		return [
			styles.cardGeneral,
			this.cardStyle,
			this.props.style
		];
	}

	getAppropriateContentStyles() {
		return [
			{
				transform: [
					{translateY: -100},
				]
			},
			this.contentStyle,
		]
	}

	getAppropriateHeaderStyles() {
		return [
			styles.headerStyle
		]
	}

	getCardAnimatableStyles() {

		let dimensionsAnimatedStyles = getAnimatableStyles(this.dimensionsAnimateVal, {

			height: {
				input: [0, 0.3, 1],
				output: [this.state.layout.height, this.state.layout.height, this.props.openCoords.height]
			},
			shadowOpacity: { from: 0, to: 0.3 },
			shadowRadius: { from: 0.5, to: 7 },
		});
		let positionAnimatedStyes = getAnimatableStyles(this.positionAnimateVal, {
			top: {
				input: [0, 0.3, 1],
				output: [this.state.layout.y, (this.props.openCoords.y - this.state.containerLayout.y) / 1.1, this.props.openCoords.y - this.state.containerLayout.y]
			},
			left: { from: this.state.layout.x, to: this.props.openCoords.x - this.state.containerLayout.x},
			width: { from: this.state.layout.width, to: this.props.openCoords.width },
		});

		return {
			position: "absolute",
			...positionAnimatedStyes,
			...dimensionsAnimatedStyles
		}
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
		// console.log("rendering")
		const containerStylesToRender = this.getAppropriateContainerStyles();
		const headerStylesToRender = this.getAppropriateHeaderStyles();
		const contentStylesToRender = this.getAppropriateContentStyles();
		const dismissIconStylesToRender = this.dismissIconStyle;

		return (
		    <TouchableOpacity onPress={this._onPress.bind(this)} onLayout={this._onContainerLayout.bind(this)}
		                      style={this.containerStyle} enabled={(this.state.isActive ? 1.0 : 0.9)}>
			    <Animated.View style={containerStylesToRender} onLayout={this._onLayout.bind(this)}>
				    <View style={headerStylesToRender} {...this.state.panResponder.panHandlers}>
					    <Text>Header</Text>
				    </View>
				    <Animated.View style={contentStylesToRender}>
					    <Text>Content</Text>
				    </Animated.View>
			    </Animated.View>
		    </TouchableOpacity>
		)
	}
}


export class Header extends Component {

	render() {
		console.log(this.props.children);
		return (
		    <View>
			    { this.props.children }
		    </View>
		)
	}
}

export class Content extends Component {
	render() {
		return (
		    <View>
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