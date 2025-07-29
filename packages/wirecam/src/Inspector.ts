import * as THREE from 'three';
import { Wirecam } from './Wirecam';
import { logDebug } from './utils/logDebug';
import Stats from 'stats.js';
import { Pane } from 'tweakpane';

interface PaneParams {
  debug: boolean;
  cameraPosX: number;
  cameraPosY: number;
  cameraPosZ: number;
  fov: number;
  clickPosX: number;
  clickPosY: number;
  clickPosZ: number;
}

/**
 * Controller class for UI controls at the page level.
 *
 * The camera movement works fundamentally without this class. The
 * Inspector shows the user control elements and information that
 * can be helpful during the development phase of the application.
 *
 * This includes:
 * - current FPS
 * - toggle debug mode on/off
 * - current camera information (position, FOV)
 * - help for placing new target objects (click-based)
 */
export class Inspector {
  private readonly document: Document;
  private readonly wirecam: Wirecam;

  private stats: Stats | null = null;

  private pane: Pane | null = null;
  private paneParams: PaneParams | null = null;

  private raycaster: THREE.Raycaster | null = null;
  private mouse: THREE.Vector2 | null = null;
  private readonly updateIntervalId: number | null = null;
  private statsUpdateCallbackId: string | null = null;

  constructor(document: Document, wirecam: Wirecam, debug?: boolean) {
    this.document = document;
    this.wirecam = wirecam;
    if (debug !== undefined) {
      this.setDebug(debug);
    }

    // Update GUI every 250ms
    this.updateIntervalId = setInterval(() => {
      this.update();
    }, 250);

    this.logDebug('Inspector', 'Initialized');
  }

  public setDebug(debug: boolean): void {
    this.wirecam.settings.debug = debug;
  }

  private createPane(): void {
    this.destroyPane();

    this.pane = new Pane({
      title: 'GUI Controls',
      expanded: true,
    });

    this.pane.element.style.position = 'fixed';
    this.pane.element.style.zIndex = '9999';

    this.paneParams = {
      debug: this.wirecam.settings.debug,
      cameraPosX: 0,
      cameraPosY: 0,
      cameraPosZ: 0,
      fov: 0,
      clickPosX: 0,
      clickPosY: 0,
      clickPosZ: 0,
    };

    // Create the pane structure using v4 API
    this.createPaneContent();
  }

  private createPaneContent(): void {
    if (!this.pane || !this.paneParams) return;

    // Debug toggle
    const debugInput = (this.pane as any).addInput(this.paneParams, 'debug', {
      label: 'Debug Mode',
    });
    debugInput.on('change', (e: { value: boolean }) => {
      this.setDebug(e.value);
    });

    // Close button
    const hideButton = (this.pane as any).addButton({
      title: 'Close GUI Controls',
    });
    hideButton.on('click', () => this.hideGuiControls());

    // Camera information folder
    const cameraPosFolder = (this.pane as any).addFolder({
      title: 'Camera',
      expanded: true,
    });
    cameraPosFolder.addInput(this.paneParams, 'cameraPosX', {
      readonly: true,
      label: 'X',
    });
    cameraPosFolder.addInput(this.paneParams, 'cameraPosY', {
      readonly: true,
      label: 'Y',
    });
    cameraPosFolder.addInput(this.paneParams, 'cameraPosZ', {
      readonly: true,
      label: 'Z',
    });
    cameraPosFolder.addInput(this.paneParams, 'fov', {
      readonly: true,
      label: 'FOV',
    });

    // Position helper folder
    const clickPosFolder = (this.pane as any).addFolder({
      title: 'Position Helper (last click)',
      expanded: true,
    });
    clickPosFolder.addInput(this.paneParams, 'clickPosX', {
      readonly: true,
      label: 'X',
    });
    clickPosFolder.addInput(this.paneParams, 'clickPosY', {
      readonly: true,
      label: 'Y',
    });
    clickPosFolder.addInput(this.paneParams, 'clickPosZ', {
      readonly: true,
      label: 'Z',
    });

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.document.removeEventListener(
      'mousedown',
      this.onDocumentMouseDown,
      false
    );
    this.document.addEventListener(
      'mousedown',
      this.onDocumentMouseDown.bind(this),
      false
    );
  }

  private onDocumentMouseDown(event: MouseEvent): void {
    if (!(this.mouse && this.raycaster && this.paneParams)) {
      return;
    }

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const sceneObjects: THREE.Object3D[] = [];
    this.wirecam.getScene().traverse((object) => {
      sceneObjects.push(object);
    });

    this.raycaster.setFromCamera(this.mouse, this.wirecam.getCamera());
    const intersects = this.raycaster.intersectObjects(sceneObjects);
    if (intersects.length > 0) {
      const intersectionPoint = intersects[0].point;
      this.paneParams.clickPosX = intersectionPoint.x;
      this.paneParams.clickPosY = intersectionPoint.y;
      this.paneParams.clickPosZ = intersectionPoint.z;
    }
  }

  private destroyPane(): void {
    if (this.pane) {
      this.pane.dispose();
    }
    this.pane = null;
    this.paneParams = null;

    this.document.removeEventListener(
      'mousedown',
      this.onDocumentMouseDown,
      false
    );
    this.raycaster = null;
    this.mouse = null;
  }

  public showGuiControls(): void {
    this.hideGuiControls();
    const stats = new Stats();
    stats.showPanel(0);
    this.document.body.appendChild(stats.dom);
    this.statsUpdateCallbackId = this.wirecam.registerUpdateCallback(() => {
      stats.update();
    });
    this.stats = stats;
    this.createPane();
  }

  public hideGuiControls(): void {
    if (this.stats) {
      this.wirecam.unregisterUpdateCallback(this.statsUpdateCallbackId);
      this.document.body.removeChild(this.stats.dom);
    }
    this.stats = null;

    this.destroyPane();
  }

  public update(): void {
    if (this.paneParams) {
      const cam = this.wirecam.getCamera();
      this.paneParams.cameraPosX = cam.position.x;
      this.paneParams.cameraPosY = cam.position.y;
      this.paneParams.cameraPosZ = cam.position.z;
      this.paneParams.fov = cam.fov;
    }
  }

  public dispose(): void {
    this.hideGuiControls();
    if (this.updateIntervalId) {
      clearInterval(this.updateIntervalId);
    }
    this.logDebug('Inspector', 'Unmounted');
  }

  private logDebug(...msg: Parameters<typeof console.log>): void {
    logDebug(this.wirecam.settings.debug, 'Wirecam', ...msg);
  }
}
