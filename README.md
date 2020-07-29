# react-native-split-pane
Split pane

# Install
`npm i react-native-split-pane`
or
`yarn add react-native-split-pane`

It depends on `react-native-app-interface`, so should execute `pod install` after install script

# Usage
```jsx harmony
import SplitPane from 'react-native-split-pane';

export default () => {
	function onChange(value) {
		console.log('onChange', value);
	}
	
	return (
		<SplitPane style={styles.container}
    		           separatorStyle={styles.separator}
    		           split="h"
    		           primary='first'
    		           defaultValue={100}
    		           min={50}
    		           max={300}
    		           onChange={onChange}
    		>
    			<View><Text>A</Text></View>
    			<View><Text>B</Text></View>
    		</SplitPane>
	);
}
```

# Props
| prop | type | required | default |
| ---- | ---- | ----     | ----    |
|split  | 'h' or 'v' | false | 'h' |
|primary  | 'first' or 'second' | false | 'first' |
|children | react-nodes | true | |
|style | any | false | |
|separatorStyle | any | false | |
|separatorWidth  | number | false | 2 |
|defaultValue | number | false | |
|value | number | false | |
|onChange | (value)=>void | false | |
|min  | number | false | 0 |
|max | number | false | |
