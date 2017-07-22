import React from 'react';
import {StyleSheet, Text, ScrollView, View, Animated} from 'react-native';

import InteractiveCard, {Header, Content} from 'react-native-interactive-card';

export default class Base  extends React.Component {
	constructor() {
		super();
	}

	render() {
		return (
			<View style={styles.container}>
				<InteractiveCard overlayOpacity={1}>
					<Header>
						<View style={styles.cardHeader}>
							<Text style={styles.text}>Header</Text>
						</View>
					</Header>
					<Content>
						<View style={styles.content}>
							<Text style={styles.text}>Content</Text>
						</View>
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
	cardHeader: {backgroundColor: "#68E9FF",padding: 30,marginBottom: 10, borderRadius: 5},
	text: {fontSize: 40, opacity: 0.6,textAlign: 'center',fontWeight: 'bold'},
	content: {width: "90%", padding: 50, backgroundColor: "#E85F53"},
});
