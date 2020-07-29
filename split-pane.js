/**
 * Created by rockyl on 2020-06-09.
 */

import React, {useState, useEffect} from 'react';
import {
	StyleSheet,
	View,
} from 'react-native';

const Pane = ({flexible = false, children, onLayout, size}) => {
	return (
		<View style={[flexible ? {flex: 1} : {...size},]} onLayout={onLayout}>
			{children}
		</View>
	)
};

let startPos = {x: 0, y: 0,};
const Separator = ({startDrag, onDragging, endDrag, style}) => {
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

	return (
		<View style={[styles.separator, style]}
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

	const [primaryStyle, setPrimaryStyle] = useState({[sizeKey]: value || defaultValue});

	const [dragging, setDragging] = useState(false);

	if (split === 'h') {
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
			setPrimaryStyle({
				width,
				height,
			})
		}
	}

	function startDrag() {
		setDragging(true);
		startSize = {
			[sizeKey]: primaryStyle[sizeKey],
		}
	}

	function onDragging(offset) {
		const sign = primary !== 'first' ? -1 : 1;
		value = Math.max(startSize[sizeKey] + sign * offset[posKey], min);
		if (max !== undefined) {
			value = Math.min(value, max);
		}
		setPrimaryStyle({
			[sizeKey]: value,
		});

		onChange && onChange(value);
	}

	function endDrag() {
		setDragging(false);
	}

	useEffect(()=>{
		setPrimaryStyle({[sizeKey]: value || defaultValue})
	}, [value]);

	return (
		<View style={wrapperStyle}>
			<Pane size={primaryStyle} flexible={primary !== 'first'}
			      onLayout={evt => onLayout(evt, primary !== 'first')}>{children[0]}</Pane>
			<Separator style={separatorStyles} onDragging={onDragging} startDrag={startDrag} endDrag={endDrag}/>
			<Pane size={primaryStyle} flexible={primary !== 'second'}
			      onLayout={evt => onLayout(evt, primary !== 'second')}>{children[1]}</Pane>
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {},
	separator: {
		backgroundColor: 'gray',
	},
});
