/**
 * Created by rockyl on 2020-06-09.
 */

import React, {useState, useEffect} from 'react';
import {
	StyleSheet,
	View,
} from 'react-native';
import {setCursor} from "react-native-app-interface";

const Pane = ({flexible = false, children, onLayout, style}) => {
	return (
		<View style={[styles.pane, flexible ? {flex: 1} : style,]} onLayout={onLayout}>
			{children}
		</View>
	)
};

let startPos = {x: 0, y: 0,};
const Separator = ({startDrag, onDragging, endDrag, style, honrizontal}) => {
	function onStartShouldSetResponder(evt) {
		return true;
	}

	function onResponderGrant(evt) {
		const {pageX, pageY} = evt.nativeEvent;
		startPos.x = pageX;
		startPos.y = pageY;
		startDrag(startPos);
	}

	function onResponderMove(evt) {
		const {pageX, pageY} = evt.nativeEvent;

		onDragging({
			x: pageX - startPos.x,
			y: pageY - startPos.y,
		});
	}

	function onResponderRelease(evt) {
		endDrag();
	}

	function onMouseEnter(evt){
		setCursor(honrizontal ? 'resizeLeftRight' : 'resizeUpDown');
	}

	function onMouseLeave(evt){
		setCursor('arrow');
	}

	return (
		<View style={[styles.separator, style]}
		      onMouseEnter={onMouseEnter}
		      onMouseLeave={onMouseLeave}
		      onStartShouldSetResponder={onStartShouldSetResponder}
		      onResponderGrant={onResponderGrant}
		      onResponderMove={onResponderMove}
		      onResponderRelease={onResponderRelease}
		/>
	)
};

let startSize;
export default ({
	                split = 'h',
	                primary = 'first',
	                children,
	                style,
	                separatorStyle,
	                separatorWidth = 2,
	                defaultValue,
	                value,
	                onChange,
	                min = 0,
	                max,
                }) => {

	const wrapperStyle = [styles.wrapper, style];
	const posKey = split === 'h' ? 'x' : 'y';
	const sizeKey = split === 'h' ? 'width' : 'height';

	const [primarySize, setPrimarySize] = useState(value || defaultValue);

	const [dragging, setDragging] = useState(false);

	const isHorizontal = split === 'h';
	if (isHorizontal) {
		wrapperStyle.push({flexDirection: 'row'})
	}

	const separatorStyles = [styles.separator, separatorStyle];
	separatorStyles.push({
		separatorStyle,
		[sizeKey]: separatorWidth,
	});

	function onLayout(evt, isPrimary) {
		if (dragging) return;
		//console.log(isPrimary, evt.nativeEvent.layout);

		const {width, height} = evt.nativeEvent.layout;
		if (!isPrimary) {
			setPrimarySize(evt.nativeEvent.layout[sizeKey])
		}
	}

	function startDrag() {
		setDragging(true);
		startSize = {
			[sizeKey]: primarySize,
		}
	}

	function onDragging(offset) {
		const sign = primary !== 'first' ? -1 : 1;
		value = Math.max(startSize[sizeKey] + sign * offset[posKey], min);
		if (max !== undefined) {
			value = Math.min(value, max);
		}
		setPrimarySize(value);

		onChange && onChange(value);
	}

	function endDrag() {
		setDragging(false);
	}

	useEffect(()=>{
		setPrimarySize(value || defaultValue)
	}, [value]);

	const paneStyle = {
		[sizeKey]: primarySize,
	};

	return (
		<View style={wrapperStyle}>
			<Pane style={paneStyle} flexible={primary !== 'first'}
			      onLayout={evt => onLayout(evt, primary !== 'first')}>{children[0]}</Pane>
			<Separator style={separatorStyles} honrizontal={isHorizontal} onDragging={onDragging} startDrag={startDrag} endDrag={endDrag}/>
			<Pane style={paneStyle} flexible={primary !== 'second'}
			      onLayout={evt => onLayout(evt, primary !== 'second')}>{children[1]}</Pane>
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {},
	separator: {
		backgroundColor: 'gray',
	},
	pane: {

	},
});
