import { getContext, hasContext, setContext } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { WithElementRef } from '$lib/utils.js';
import type { ManagedCanvas, Wirecam } from 'wirecam';
import type { Keyframe } from 'wirecam';
import * as THREE from 'three';

export type WirecamRootProps = {
	debug?: boolean;
	backgroundColor?: THREE.ColorRepresentation;
	antialias?: boolean;
	alpha?: boolean;
	pixelRatio?: number;
	autoStart?: boolean;
} & WithElementRef<HTMLAttributes<HTMLDivElement>>;

export type WirecamCanvasProps = {
	class?: string;
} & WithElementRef<HTMLAttributes<HTMLDivElement>>;

export type WirecamKeyframeProps = {
	options: Partial<Omit<Keyframe, 'ref'>>;
} & WithElementRef<HTMLAttributes<HTMLDivElement>>;

const WIRECAM_CONTEXT = Symbol('WIRECAM_CONTEXT');

export type WirecamContext = {
	managedCanvas: ManagedCanvas | undefined;
	scene: THREE.Scene | undefined;
	camera: THREE.PerspectiveCamera | undefined;
	renderer: THREE.WebGLRenderer | undefined;
	wirecam: Wirecam | undefined;
	debug: boolean;
	backgroundColor: THREE.ColorRepresentation;
	antialias: boolean;
	alpha: boolean;
	pixelRatio: number;
	autoStart: boolean;
};

export function setWirecamContext(config: WirecamContext): WirecamContext {
	setContext(WIRECAM_CONTEXT, config);
	return config;
}

export function getWirecamContext(name?: string) {
	if (!hasContext(WIRECAM_CONTEXT)) {
		const componentName = name || 'This component';
		throw new Error(`${componentName} must be used within a <W.Root> component`);
	}
	return getContext<ReturnType<typeof setWirecamContext>>(WIRECAM_CONTEXT);
}
