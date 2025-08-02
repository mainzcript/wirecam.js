import * as THREE from 'three';
import { Wirecam } from './Wirecam';

type ManagedCanvasOptions = {
  container: HTMLElement;
  autoStart?: boolean;
  debug?: boolean;
  backgroundColor?: THREE.ColorRepresentation;
  antialias?: boolean;
  alpha?: boolean;
  pixelRatio?: number;
};

/**
 * Managed canvas class that handles Three.js setup and lifecycle with Wirecam integration.
 *
 * This class creates and manages the renderer, scene, and camera,
 * and provides a simple interface for using Wirecam with just an HTML container.
 */
export class ManagedCanvas {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private wirecam: Wirecam;
  private animationFrameId: number | null = null;
  private resizeObserver: ResizeObserver;

  constructor(options: ManagedCanvasOptions) {
    const {
      container,
      autoStart = true,
      debug = false,
      backgroundColor = 0x000000,
      antialias = true,
      alpha = true,
      pixelRatio = window.devicePixelRatio,
    } = options;

    this.container = container;

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias,
      alpha,
    });
    this.renderer.setPixelRatio(pixelRatio);
    if (alpha) {
      // Transparent background
      this.renderer.setClearColor(backgroundColor, 0);
    } else {
      // Solid background
      this.renderer.setClearColor(backgroundColor);
    }
    this.container.appendChild(this.renderer.domElement);

    // Create scene
    this.scene = new THREE.Scene();

    // Create camera
    this.camera = new THREE.PerspectiveCamera();

    // Create Wirecam instance
    this.wirecam = new Wirecam({
      renderer: this.renderer,
      scene: this.scene,
      camera: this.camera,
      autoStart: false, // We'll handle the loop ourselves
      debug,
    });

    // Setup resize observer
    this.resizeObserver = new ResizeObserver(() => {
      this.handleResize();
    });
    this.resizeObserver.observe(this.container);

    // Handle initial resize
    this.handleResize();

    // Start if autoStart is true
    if (autoStart) {
      this.start();
    }
  }

  /**
   * Get the Wirecam instance for adding keyframes and other operations.
   */
  public getWirecam(): Wirecam {
    return this.wirecam;
  }

  /**
   * Get the Three.js scene for adding objects.
   */
  public getScene(): THREE.Scene {
    return this.scene;
  }

  /**
   * Get the Three.js camera.
   */
  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  /**
   * Get the Three.js renderer.
   */
  public getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  /**
   * Start the animation loop.
   */
  public start(): void {
    if (this.animationFrameId !== null) return;

    this.wirecam.start();
    this.animate();
  }

  /**
   * Stop the animation loop.
   */
  public stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.wirecam.stop();
  }

  /**
   * Handle container resize.
   */
  private handleResize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  /**
   * Animation loop.
   */
  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  };

  /**
   * Dispose of all resources.
   */
  public dispose(): void {
    this.stop();

    // Dispose Wirecam
    this.wirecam.dispose();

    // Dispose resize observer
    this.resizeObserver.disconnect();

    // Dispose renderer
    this.renderer.dispose();

    // Remove canvas from container
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
