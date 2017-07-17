import React from 'react';
import {StyleSheet, Text, ScrollView} from 'react-native';

import InteractiveCard, {Header, Content} from '../InteractiveCard';

export default class App extends React.Component {
	constructor() {
		super();
		this.state = {activeCard : true}
	}
	render() {
		return (
			<ScrollView style={styles.container}>
				<InteractiveCard name={"1"} style={styles.cardStyles} openCoords={{y: 5, x: 5, height: 260, width: 300}}>
					<Header style={styles.cardHeader}><Text>header stuff</Text></Header>
					<Content style={styles.content}><Text>content stuff</Text></Content>
				</InteractiveCard>
				<InteractiveCard name={"2"} style={styles.cardStyles} openCoords={{y: 5, x: 5, height: 260, width: 300}}>
					<Header style={styles.cardHeader}><Text>header stuff</Text></Header>
					<Content style={styles.content}><Text>content stuff</Text></Content>
				</InteractiveCard>
				<InteractiveCard name={"3"} style={styles.cardStyles} openCoords={{y: 5, x: 5, height: 260, width: 300}}>
					<Header style={styles.cardHeader}><Text>header stuff</Text></Header>
					<Content style={styles.content}><Text>content stuff</Text></Content>
				</InteractiveCard>
				<InteractiveCard name={"4"} style={styles.cardStyles} openCoords={{y: 5, x: 5, height: 260, width: 300}}>
					<Header style={styles.cardHeader}><Text>header stuff</Text></Header>
					<Content style={styles.content}><Text>content stuff</Text></Content>
				</InteractiveCard>
				<InteractiveCard name={"5"} style={styles.cardStyles} openCoords={{y: 5, x: 5, height: 260, width: 300}}>
					<Header style={styles.cardHeader}><Text>header stuff</Text></Header>
					<Content style={styles.content}><Text>content stuff</Text></Content>
				</InteractiveCard>
			</ScrollView>
		);
	}
}

const cardHeight = 102.44;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	cardStyles: {
		flex: 1,
		borderRadius: 10,
		marginBottom: 10,
	},
	cardHeader: {
		height: 100,
	},
	content: {
		backgroundColor: 'green',
		height: 300
	}
});
