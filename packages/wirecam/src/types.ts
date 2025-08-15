import * as THREE from 'three';

/**
 * Keyframe for camera movement.
 *
 * The camera is positioned and oriented based on keyframes. Each
 * keyframe is linked to an HTML element and defines a
 * target position and viewing direction in the scene.
 */
export type Keyframe = {
  /** linked HTML element */
  ref: HTMLElement | string;

  /** camera position */
  cameraPos: THREE.Vector3;

  /** camera up vector */
  cameraUp: THREE.Vector3;

  /** target element in the scene to which the viewing direction points */
  worldTargetPos: THREE.Vector3;

  /** Defines a sphere around the target element that should exactly fill the reference element when the keyframe is active */
  worldTargetRadius: number;

  /** Easing dampens the camera movement near the keyframe */
  easeIn: boolean;
  easeOut: boolean;

  /** Optional callback to be called when the live values are updated */
  onUpdate?: (liveValues: KeyframeLiveValues) => void;
};

export type LinkedKeyframe = Keyframe & {
  ref: HTMLElement;
};

export type KeyframeLiveValues = {
  /**
   * The keyframe is active if the activity is greater than 0.
   *
   * 0 = the keyframe is not active
   * (0, 1) = the keyframe is blending with another keyframe
   * 1 = this keyframe is in the center
   */
  activity: number;
};

export type LiveKeyframe = Partial<LinkedKeyframe> & {
  ref: HTMLElement; // For performance reasons, we ensure that the reference is stored as an HTMLElement
  liveValues: KeyframeLiveValues; // The live values of the keyframe, updated in real-time
};
