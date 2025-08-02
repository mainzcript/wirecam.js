import Root from './wirecam.svelte';
import Canvas from './wirecam-canvas.svelte';
import Content from './wirecam-content.svelte';
import Keyframe from './wirecam-keyframe.svelte';
import Default from './wirecam-default.svelte';
import { getWirecamContext } from './context.js';

export { Root, Canvas, Content, Keyframe, Default, getWirecamContext };

// Create namespace export
export const W = {
	Root,
	Canvas,
	Content,
	Keyframe,
	Default
};

// Alias for better naming
export const useWirecam = getWirecamContext;
