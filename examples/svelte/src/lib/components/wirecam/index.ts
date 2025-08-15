import Root from './wirecam.svelte';
import Canvas from './wirecam-canvas.svelte';
import Content from './wirecam-content.svelte';
import Keyframe from './wirecam-keyframe.svelte';
import Viewport from './wirecam-viewport.svelte';
import { getWirecamContext } from './context.js';

export { Root, Canvas, Content, Keyframe, Viewport, getWirecamContext };

// Create namespace export
export const W = {
	Root,
	Canvas,
	Content,
	Keyframe,
	Viewport
};

// Alias for better naming
export const useWirecam = getWirecamContext;
