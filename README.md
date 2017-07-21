# react-native-interactive-card
Interactive Cards for React Native

<div style="text-align: center;"><img src="https://thumbs.gfycat.com/PinkCourteousHerculesbeetle-size_restricted.gif" /></div>

## Table of Content
- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)

# Usage
```javascript

let generateProject = project => {
  let code = [];
  for (let js = 0; js < project.length; js++) {
    code.push(js);
  }
};
```

# Props

### InteractiveCard
| Prop  | Type | Description|
| :---: |:---:| :---:|
| `openCoords` | `obeject`: `{y: number, x: number}` | The `x` & `y` coordinates of the location that the card should be in when it opens. The origin(`y:0, x:0`) is the top left of the parent view.
### Header
### Content
| Prop  | Type | Description|
| :---: |:---:| :---:|
| `enterFrom` | `enum`: `"bottom"`,`"top"`,`"right"`,`"left"`,`"none"` | Direction from which the content enters. Defaults to `"top"`|

