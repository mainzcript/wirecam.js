import * as THREE from 'three';

/**
 * Recursively sets opacity on any Object3D (including child meshes).
 * @param object  - The root Object3D or Mesh whose material(s) should become transparent.
 * @param opacity - Desired opacity value between 0 (fully transparent) and 1 (fully opaque).
 */
export function setObjectOpacity(
  object: THREE.Object3D,
  opacity: number
): void {
  object.traverse((node) => {
    // Only process Mesh nodes
    if ((node as THREE.Mesh).isMesh) {
      const mesh = node as THREE.Mesh;
      // Normalize material(s) to an array
      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      for (const material of materials) {
        // If the material supports opacity...
        if ('opacity' in material) {
          // Enable transparency so opacity is respected
          material.transparent = true;
          (material as THREE.Material & { opacity: number }).opacity = opacity;
          // Trigger a shader/material update if supported
          if ('needsUpdate' in material) {
            material.needsUpdate = true;
          }
        }
      }
    }
  });
}