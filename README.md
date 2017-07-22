# react-native-interactive-card
> Interactive Cards for React Native

<p align="center"><img width="300" src="https://thumbs.gfycat.com/DecisiveUnfoldedCaudata-size_restricted.gif" /></p>

## Table of Content
- [Usage](#usage)
- [Props](#props)

# Usage

```javascript
import InteractiveCard, { Content, Header } from 'react-native-interactive-card'
```
#### Basic
```JSX

// render() {
//    return (
	<InteractiveCard>
	    <Header>
		// Header View...
	    </Header>
	    <Content>
		// Content View
	    </Content>
	</InteractiveCard>
//    );
// }
```

#### Cool
<img width="250" align="right" src="https://thumbs.gfycat.com/AmusedCompleteGallowaycow-size_restricted.gif" />

```JSX
const cardOptions = { overlayOpacity : 1 };
const contentOptions = { enterFrom: "right" }

<InteractiveCard {...cardOptions}>
    <Header>
    	<View style={headerStyle}>
	    <Text style={styles.text}>Header</Text>
	</View>
    </Header>
    <Content {...contentOptions}>
    	<View style={contentStyle}>
	    <Text style={textStyle}>Content</Text>
	</View>
    </Content>
</InteractiveCard>

const headerStyle = {
	backgroundColor: "#68E9FF", padding: 30, 
	marginBottom: 10, borderRadius: 5 
};
const textStyle = {
	fontSize: 40, opacity: 0.6,
	textAlign: 'center', fontWeight: 'bold'
};
const contentStyle = {
	width: "90%", padding: 50, 
	backgroundColor: "#E85F53"
};

```

# Props

### InteractiveCard
| Prop  | Type | Description|
| :---: |:---:| :---:|
| `openCoords` | `object: {y: number, x: number}` | The `x` & `y` coordinates of the location that the card should be in when it opens. Where the origin i.e (0,0) is the top left of the parent view. **Default:** `{y: 20, x: 20}`. |
| `overlayOpacity` | `number` | Opacity of the overlay under the card when it opens. **Defalut:** `0.8`. _Tip: set this value to `1.0` to completely "hide" the rest of the cards underneath._ |
| `overlayColor`   | `string` | Overlay color. |
| `onOpen` |  `function` | Callback that gets called when the user opens the card. **Passed:** the card object |
| `onClose` | `function` | Callback that gets called when the card closes. **Passed:** the card object |
| `onAnimationProgress` | `function` | Callback that gets called every animation frame of the card. **Passed:** Animation progress in a scale of `0` to `1` (where `1` is the card open). |
| `onDraggingProgress` | `function` | Callback that gets called for every panning movement while the card is being dragged. **Passed:** The progress of the panning a scale of `0` to `1` (where `1` is the card open). _Note that the number can exceed `0` or `1` when the user keeps panning even further._ |


### Content
| Prop  | Type | Description|
| :---: |:---:| :---:|
| `enterFrom` | `enum`: `"bottom"`,`"top"`,`"right"`,`"left"`,`"none"` | Direction from which the content enters. **Default:** `"top"`|

