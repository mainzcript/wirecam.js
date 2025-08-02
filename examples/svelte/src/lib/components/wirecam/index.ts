import Root from './wirecam.svelte';
import Canvas from './wirecam-canvas.svelte';
import Content from './wirecam-content.svelte';
import Keyframe from './wirecam-keyframe.svelte';

export { Root, Canvas, Content, Keyframe };

// Create namespace export
export const W = {
	Root,
	Canvas,
	Content,
	Keyframe
};
