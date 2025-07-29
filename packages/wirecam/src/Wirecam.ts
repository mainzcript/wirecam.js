import * as THREE from 'three';
import type { Keyframe, LinkedKeyframe, LiveKeyframe } from './types';
import { setObjectOpacity } from './utils/setObjectOpacity';
import { ease, lerp } from './utils/math';
import { logDebug } from './utils/logDebug';
import PositionSpy, { type ROI } from './utils/PositionSpy';
import { radToDeg } from 'three/src/math/MathUtils.js';
import { generateUUID } from './utils/uuid';

type WirecamKeyframe = LiveKeyframe & {
  posSpy: PositionSpy;
  refOffset: {
    x: number;
    y: number;
  };
  refRadius: number;
  lookAtPoint: THREE.Vector3;
  tmpCameraPosition: THREE.Vector3;
  correctedCameraUp: THREE.Vector3;
  fov: number;
  worldTargetPosIndicator: THREE.Mesh;
  lookAtIndicator: THREE.Mesh;
};

type WirecamSettings = {
  debug: boolean;
};

type WirecamDefaults = {
  keyframe: LinkedKeyframe;
};

type WirecamOptions = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  autoStart?: boolean;
  debug?: boolean;
};

/**
 * Central controller class for the camera during camera movement.
 *
 * This class manages camera position, rotation, and settings
 * based on the defined keyframes. It enables adding,
 * removing, and updating keyframes that control the camera movement.
 */
export class Wirecam {
  public settings: WirecamSettings = {
    debug: false,
  };
  public defaults: WirecamDefaults = {
    keyframe: {
      ref: document.body,
      cameraPos: new THREE.Vector3(0, 0, 0),
      cameraUp: new THREE.Vector3(0, 1, 0),
      worldTargetPos: new THREE.Vector3(0, 0, 1),
      worldTargetRadius: 1,
      easeIn: true,
      easeOut: true,
    },
  };
  public readonly scene: THREE.Scene;
  private readonly refIndicator: HTMLDivElement;
  public readonly camera: THREE.PerspectiveCamera;
  private readonly viewportPosSpy: PositionSpy;
  private viewportRoi: ROI = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    visibleRatio: 0,
    screenRatio: 0,
  };
  private keyframes: { [id: string]: WirecamKeyframe } = {};
  private currentKeyframes: {
    prev: WirecamKeyframe;
    next: WirecamKeyframe;
    blendFactor: number;
  } | null = null;
  private running = false;
  private updateCallbacks: { [id: string]: () => void } = {};

  constructor(options: WirecamOptions) {
    const {
      renderer,
      scene,
      camera,
      autoStart = true,
      debug = false,
    } = options;

    this.scene = scene;
    this.camera = camera;

    this.settings.debug = debug;

    this.viewportPosSpy = new PositionSpy(renderer.domElement);

    const refIndicator = document.createElement('div');
    Object.assign(refIndicator.style, {
      position: 'fixed',
      border: '2px solid red',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      zIndex: '9999',
      borderRadius: '50%',
      top: '50%',
      left: '50%',
    });
    document.body.appendChild(refIndicator);
    this.refIndicator = refIndicator;

    if (autoStart) {
      this.start();
    }

    this.logDebug('Wirecam', 'Initialized');
  }

  /**
   * Adds a keyframe to the camera movement. An HTML element
   * (referenced via CSS selector) is linked with an ideal camera position and
   * a target point in the 3D scene.
   *
   * @param keyframe Keyframe with optional attributes (see complete
   *                 {@link Keyframe})
   * @returns ID of the added keyframe, null in case of error.
   */
  public addKeyframe(keyframe: Partial<Keyframe>): string | null {
    // 1. Validate ref element and convert to LinkedKeyframe
    if (typeof keyframe.ref === 'string') {
      const ref = document.querySelector<HTMLElement>(keyframe.ref);
      if (ref) {
        keyframe.ref = ref;
      } else {
        console.error(`Target element not found: ${keyframe.ref}`);
        return null;
      }
    }
    keyframe.ref = keyframe.ref as HTMLElement;

    // 2. Generate a unique ID for the keyframe
    const id = generateUUID();

    // 3. Create yellow sphere
    const sphereGeometry = new THREE.SphereGeometry(
      this.defaults.keyframe.worldTargetRadius,
      16,
      16
    );
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.copy(this.defaults.keyframe.worldTargetPos);

    // 3. Create lookAt indicator
    const indicatorGeometry = new THREE.SphereGeometry(1, 16, 16);
    const indicatorMaterial = sphereMaterial.clone();
    indicatorMaterial.color.set(0xff00ff);
    const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
    indicator.position.copy(this.defaults.keyframe.worldTargetPos);

    // 4. Save keyframe & set provisional values (will be updated automatically later)
    this.keyframes[id] = {
      ...keyframe,
      liveValues: {
        activity: 0,
      },
      posSpy: new PositionSpy(keyframe.ref),
      refRadius: 0,
      refOffset: { x: 0, y: 0 },
      lookAtPoint: new THREE.Vector3(),
      tmpCameraPosition: new THREE.Vector3(),
      correctedCameraUp: new THREE.Vector3(),
      fov: 0,
      worldTargetPosIndicator: sphere,
      lookAtIndicator: indicator,
    } as WirecamKeyframe;

    this.logDebug('Wirecam', 'Keyframe added', id);

    return id;
  }

  public removeKeyframe(id: string): void {
    const kf = this.keyframes[id];
    if (kf) {
      this.scene.remove(kf.worldTargetPosIndicator);
      this.scene.remove(kf.lookAtIndicator);
      kf.posSpy.dispose();
      delete this.keyframes[id];
      this.logDebug('Wirecam', 'Keyframe removed', id);
    } else {
      console.warn('Wirecam', 'Keyframe not found', id);
    }
  }

  start() {
    this.running = true;
    this.animate();
    this.logDebug('Wirecam', 'Started');
  }

  stop() {
    this.running = false;
    this.logDebug('Wirecam', 'Stopped');
  }

  private animate = () => {
    if (!this.running) return;
    this.update();
    requestAnimationFrame(this.animate);
  };

  public clear() {
    // 1. Reset keyframes
    for (const id in this.keyframes) {
      this.removeKeyframe(id);
    }

    // 2. Reset update callbacks
    for (const id in this.updateCallbacks) {
      this.unregisterUpdateCallback(id);
    }

    // 3. Log if debug is enabled
    this.logDebug('Wirecam', 'Reset');
  }

  public dispose() {
    this.stop();
    this.clear();
    document.body.removeChild(this.refIndicator);
    this.logDebug('Wirecam', 'Unmounted');
  }

  private update(): void {
    this.updateViewport();
    this.updateKeyframeRefs();
    this.updateCurrentKeyframes();
    this.updateKeyframeLiveValues();
    this.updateKeyframeDerivedValues();
    this.applyKeyframeBlend();
    this.updateDebugMode();
    for (const cb of Object.values(this.updateCallbacks)) {
      try {
        cb();
      } catch (err) {
        console.error('Error in updateCallback:', err);
      }
    }
  }

  public updateViewport() {
    this.viewportRoi = this.viewportPosSpy.getRoi();
  }

  private updateKeyframeRefs() {
    // 1. Cancel if no keyframes are present
    if (Object.keys(this.keyframes).length === 0) return;

    // 2. Update references
    for (const id in this.keyframes) {
      const kf = this.keyframes[id];
      const refRoi = kf.posSpy.getRoi();
      kf.refOffset = {
        x: refRoi.x - this.viewportRoi.x,
        y: refRoi.y - this.viewportRoi.y,
      };
      const radius = Math.min(refRoi.width, refRoi.height) / 2;
      kf.refRadius = radius;
    }
  }

  private updateCurrentKeyframes() {
    // 1. Cancel if no keyframes are present
    if (Object.keys(this.keyframes).length === 0) {
      this.currentKeyframes = null;
      return;
    }

    // 2. Infinite distance for unconnected keyframes
    const hackedKeyframes = this.keyframes;
    for (const id in hackedKeyframes) {
      const kf = hackedKeyframes[id];
      if (!kf.ref.isConnected || kf.refRadius <= 0) {
        kf.refOffset = { x: Infinity, y: Infinity };
      }
    }

    // 3. Sort keyframes by y-offset
    const sortedKeyframes = Object.values(hackedKeyframes).sort((a, b) => {
      return a.refOffset.y - b.refOffset.y;
    });

    // 4. Determine current keyframes
    let prevKeyframe: WirecamKeyframe = sortedKeyframes[0];
    let nextKeyframe: WirecamKeyframe | null = null;
    sortedKeyframes.forEach((keyframe) => {
      if (
        keyframe.refOffset.y <= 0 &&
        keyframe.refOffset.y > prevKeyframe.refOffset.y
      ) {
        prevKeyframe = keyframe;
      }
      if (
        keyframe.refOffset.y > 0 &&
        (!nextKeyframe || keyframe.refOffset.y < nextKeyframe.refOffset.y)
      ) {
        nextKeyframe = keyframe;
      }
    });

    // 5. Calculate blending factor
    let t = 0;
    if (!nextKeyframe) {
      nextKeyframe = prevKeyframe;
    }
    if (prevKeyframe.refOffset.y !== nextKeyframe.refOffset.y) {
      nextKeyframe = nextKeyframe as WirecamKeyframe;
      const total =
        Math.abs(prevKeyframe.refOffset.y) + Math.abs(nextKeyframe.refOffset.y);
      const tRaw = Math.abs(prevKeyframe.refOffset.y) / total;
      t = ease(
        tRaw,
        nextKeyframe.easeIn ?? this.defaults.keyframe.easeIn,
        prevKeyframe.easeOut ?? this.defaults.keyframe.easeOut
      );
    }

    // 6. Save current keyframes
    this.currentKeyframes = {
      prev: prevKeyframe,
      next: nextKeyframe,
      blendFactor: t,
    };
  }

  private updateKeyframeLiveValues() {
    // 1. Cancel if no keyframes are active or no keyframes are present
    if (!this.currentKeyframes || Object.keys(this.keyframes).length === 0)
      return;

    for (const id in this.keyframes) {
      const kf = this.keyframes[id];

      // 2. Update live values
      if (kf === this.currentKeyframes.prev) {
        kf.liveValues.activity = 1 - this.currentKeyframes.blendFactor;
      } else if (kf === this.currentKeyframes.next) {
        kf.liveValues.activity = this.currentKeyframes.blendFactor;
      } else {
        kf.liveValues.activity = 0;
      }

      // 3. TODO: Additional live values could be updated here, e.g. for animations or interactions

      // 4. Call callback if present
      if (kf.onUpdate) {
        kf.onUpdate(kf.liveValues);
      }
    }
  }

  private updateKeyframeDerivedValues(): void {
    for (const kf of [
      this.currentKeyframes?.prev,
      this.currentKeyframes?.next,
    ]) {
      if (!kf) continue;

      // 1. Set default values if not present
      const worldTargetRadius =
        kf.worldTargetRadius ?? this.defaults.keyframe.worldTargetRadius;
      const worldTargetPos =
        kf.worldTargetPos ?? this.defaults.keyframe.worldTargetPos;
      const cameraPos = kf.cameraPos ?? this.defaults.keyframe.cameraPos;
      const cameraUp = kf.cameraUp ?? this.defaults.keyframe.cameraUp;

      // 2. Calculate viewing angle
      const dist = cameraPos.distanceTo(worldTargetPos);
      const ratio = worldTargetRadius / dist;
      const clampedRatio = Math.min(1, Math.max(-1, ratio));
      const gamma = Math.asin(clampedRatio); // halber Objekt-Winkel
      const x = kf.refOffset.x - kf.refRadius;
      const tan2Gamma = Math.tan(2 * gamma);
      const refDiameter = 2 * kf.refRadius;
      const disc =
        refDiameter ** 2 - 4 * x * (x + refDiameter) * tan2Gamma ** 2;
      const clampedDisc = Math.max(0, disc);
      const h = (refDiameter + Math.sqrt(clampedDisc)) / (2 * tan2Gamma);
      const beta = Math.atan((kf.refOffset.x + kf.refRadius) / h) - gamma; // x-Offset-Winkel
      const alpha = Math.atan(this.viewportRoi.height / 2 / h);

      // 3. FOV calculation
      const fov = 2 * alpha;

      // 4. Calculate cartesian coordinates
      const targetVec = worldTargetPos.clone().sub(cameraPos);
      const EPS = 1e-6;
      const right_tmp = targetVec.clone().cross(cameraUp);
      if (Math.abs(right_tmp.length()) < EPS) {
        right_tmp.copy(targetVec.clone().cross(new THREE.Vector3(1, 1, 1)));
        if (right_tmp.lengthSq() < EPS) {
          right_tmp.copy(targetVec.clone().cross(new THREE.Vector3(0, 1, 0)));
        }
      }
      const up = right_tmp.clone().cross(targetVec).normalize();
      const forward = targetVec.applyAxisAngle(up, beta).normalize();

      // 5. Calculate look-at point
      const lookAtPoint = cameraPos
        .clone()
        .add(forward.clone().multiplyScalar(dist));

      // 6. Set values
      kf.fov = radToDeg(fov);
      kf.lookAtPoint = lookAtPoint;
      kf.tmpCameraPosition = cameraPos.clone();
      kf.correctedCameraUp = up.clone();

      // 7. Target and look-at indicators
      const pxToWorld = dist / h;
      kf.worldTargetPosIndicator.position.copy(worldTargetPos);
      kf.worldTargetPosIndicator.scale.set(
        worldTargetRadius,
        worldTargetRadius,
        worldTargetRadius
      );
      kf.lookAtIndicator.position.copy(kf.lookAtPoint);
      kf.lookAtIndicator.scale.setScalar(25 * pxToWorld);
    }
  }

  private applyKeyframeBlend(): void {
    // 1. Cancel if no keyframes are active
    if (!this.currentKeyframes) return;

    const { prev, next, blendFactor: t } = this.currentKeyframes;

    // 2. Camera position
    const cameraPos = new THREE.Vector3()
      .copy(prev.tmpCameraPosition)
      .lerp(next.tmpCameraPosition, t);
    this.camera.position.copy(cameraPos);

    // 3. Update camera
    // 3.1 Rotation (Quaternion)
    const quatA = new THREE.Quaternion().setFromRotationMatrix(
      new THREE.Matrix4().lookAt(
        prev.tmpCameraPosition,
        prev.lookAtPoint,
        prev.correctedCameraUp
      )
    );
    const quatB = new THREE.Quaternion().setFromRotationMatrix(
      new THREE.Matrix4().lookAt(
        next.tmpCameraPosition,
        next.lookAtPoint,
        next.correctedCameraUp
      )
    );
    const interpolatedQuat = quatA.slerp(quatB, t);
    this.camera.quaternion.copy(interpolatedQuat);

    // 3.2 FOV calculation
    this.camera.fov = lerp(prev.fov, next.fov, t);

    // 3.3 Update aspect ratio
    this.camera.aspect = this.viewportRoi.width / this.viewportRoi.height;

    // 3.4 Update projection matrix
    this.camera.updateProjectionMatrix();

    // 4. Interpolate debug transparency
    for (const id in this.keyframes) {
      const kf = this.keyframes[id];
      const activity = kf.liveValues.activity;
      setObjectOpacity(kf.lookAtIndicator, activity * 0.5);
      setObjectOpacity(kf.worldTargetPosIndicator, activity * 0.3);
    }

    // 5. Update reference indicator
    const refX =
      lerp(prev.refOffset.x, next.refOffset.x, t) + this.viewportRoi.x;
    const refY =
      lerp(prev.refOffset.y, next.refOffset.y, t) + this.viewportRoi.y;
    const diameter = lerp(prev.refRadius, next.refRadius, t) * 2;
    this.refIndicator.style.top = `${refY}px`;
    this.refIndicator.style.left = `${refX}px`;
    this.refIndicator.style.width = `${diameter}px`;
    this.refIndicator.style.height = `${diameter}px`;
  }

  updateDebugMode() {
    for (const id in this.keyframes) {
      const kf = this.keyframes[id];
      this.scene.remove(kf.worldTargetPosIndicator);
      this.scene.remove(kf.lookAtIndicator);
      kf.ref.style.backgroundColor = '';
      kf.ref.style.outline = '';
    }
    if (this.settings.debug) {
      this.refIndicator.style.display = 'block';
      for (const kf of [
        this.currentKeyframes?.prev,
        this.currentKeyframes?.next,
      ]) {
        if (!kf) continue;
        this.scene.add(kf.worldTargetPosIndicator);
        this.scene.add(kf.lookAtIndicator);
        kf.ref.style.backgroundColor = 'rgba(0, 255, 0, 0.25)';
        kf.ref.style.outline = '2px solid rgb(0, 255, 0)';
      }
    } else {
      this.refIndicator.style.display = 'none';
    }
  }

  /**
   * Registers a function that is called on every camera update.
   * @param fn Callback without arguments
   * @return ID of the callback that can be used for later unregistration
   */
  public registerUpdateCallback(fn: () => void): string {
    const id = generateUUID();
    this.updateCallbacks[id] = fn;
    return id;
  }

  /**
   * Removes the registration of a previously registered update callback.
   * @param id ID of the callback that was returned by `registerUpdateCallback`
   */
  public unregisterUpdateCallback(id: string | null): void {
    if (!id) return;
    if (this.updateCallbacks[id]) {
      delete this.updateCallbacks[id];
      this.logDebug('Wirecam', 'Update callback unregistered', id);
    } else {
      console.warn('Wirecam', 'Update callback not found', id);
    }
  }

  private logDebug(...msg: Parameters<typeof console.log>): void {
    logDebug(this.settings.debug, 'Wirecam', ...msg);
  }
}
