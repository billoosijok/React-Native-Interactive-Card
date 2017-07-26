# react-native-interactive-card
Customizable interactive card component for React Native

<p align="center"><img width="250" src="https://thumbs.gfycat.com/DecisiveUnfoldedCaudata-size_restricted.gif" /></p>

## Table of Content
- ⬇️ [Installation](#installation)
- 🎉 [Usage](#usage)
- 📲 [Examples](#examples)
- ⚙️ [Props](#props)
- ⚖️ [License](#license)

# ⬇️ Installation
#### npm
```Shell
npm install react-native-interactive-card
```
#### yarn
```Shell
yarn add react-native-interactive-card
```

# 🎉 Usage

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

# 📲 Examples
- [Base](https://github.com/billoosijok/react-native-interactive-card/tree/master/Example/App#base)
- [Custom Transition](https://github.com/billoosijok/react-native-interactive-card/tree/master/Example/App#custom-transition)
- [Cards In ScollView](https://github.com/billoosijok/react-native-interactive-card/tree/master/Example/App#cards-in-scrollview)
- [iPad](https://github.com/billoosijok/react-native-interactive-card/tree/master/Example/App#ipad)

# ⚙️ Props
- [`<InteractiveCard>`](#interactivecard)
- [`<Content>`](#content)

### `<InteractiveCard>`
| Prop  | Type | Description|
| :---: |:---:| :---:|
| `openCoords` | `object: {y: number, x: number}` | The `x` & `y` coordinates of the location that the card should be in the window when it opens. Where the origin i.e (0,0) is the top left of the window. If you don't want `y` or `x` to change, just pass `null`.<br> The `x` supports a special value `"center"` to be passed, where the card will be centered in the screen<br> **Default:** `{y: 20, x: "center"}`.   |
| `overlayOpacity` | `number` | Opacity of the overlay under the card when it opens. <br> **Default:** `0.8`. _Tip: set this value to `1.0` to completely "hide" the rest of the cards underneath._ |
| `overlayColor`   | `string` | Overlay color. |
| `onOpen` |  `function` | Callback that gets called when the user opens the card. <br> **Passed:** the card object |
| `onClose` | `function` | Callback that gets called when the card closes. <br> **Passed:** the card object |
| `onAnimationProgress` | `function` | Callback that gets called every animation frame of the card. <br> **Passed:** Animation progress in a scale of `0` to `1` (where `1` is the card open). |
| `onDraggingProgress` | `function` | Callback that gets called for every panning movement while the card is being dragged. <br> **Passed:** The progress of the panning a scale of `0` to `1` (where `1` is the card open). <br><br> _Note that the number can exceed `0` or `1` when the user keeps panning even further._ |


### `<Content>`
| Prop  | Type | Description|
| :---: |:---:| :---:|
| `enterFrom` | `enum`: `"bottom"`,`"top"`,`"right"`,`"left"`,`"none"` | Direction from which the content enters. **Default:** `"top"`|

# ⚖️ License
[MIT](https://github.com/billoosijok/react-native-interactive-card/blob/master/LICENSE)

