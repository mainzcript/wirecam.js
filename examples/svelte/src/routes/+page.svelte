<script>
	import { Canvas, T } from '@threlte/core';
</script>

<div class="scene-container">
	<Canvas>
		<!-- Lighting -->
		<T.AmbientLight intensity={0.4}></T.AmbientLight>
		<T.DirectionalLight position={[10, 10, 5]} intensity={1} castShadow></T.DirectionalLight>
		<T.PointLight position={[-10, -10, -10]} intensity={0.5}></T.PointLight>

		<!-- Geometric Shapes -->
		<T.Mesh position={[-4, 0, 0]}>
			<T.BoxGeometry args={[2, 2, 2]}></T.BoxGeometry>
			<T.MeshStandardMaterial color="#ff6b6b"></T.MeshStandardMaterial>
		</T.Mesh>

		<T.Mesh position={[0, 0, 0]}>
			<T.SphereGeometry args={[1.5]}></T.SphereGeometry>
			<T.MeshStandardMaterial color="#4ecdc4"></T.MeshStandardMaterial>
		</T.Mesh>

		<T.Mesh position={[4, 0, 0]}>
			<T.CylinderGeometry args={[1, 1, 3]}></T.CylinderGeometry>
			<T.MeshStandardMaterial color="#45b7d1"></T.MeshStandardMaterial>
		</T.Mesh>

		<T.Mesh position={[0, 4, 0]}>
			<T.TorusGeometry args={[1.5, 0.5]}></T.TorusGeometry>
			<T.MeshStandardMaterial color="#96ceb4"></T.MeshStandardMaterial>
		</T.Mesh>

		<!-- Ground Plane -->
		<T.Mesh position={[0, -2, 0]}>
			<T.BoxGeometry args={[20, 0.1, 20]}></T.BoxGeometry>
			<T.MeshStandardMaterial color="#f0f0f0"></T.MeshStandardMaterial>
		</T.Mesh>

		<!-- Camera -->
		<T.PerspectiveCamera
			position={[10, 10, 10]}
			oncreate={(ref) => {
				ref.lookAt(0, 0, 0);
			}}
		></T.PerspectiveCamera>
	</Canvas>
</div>

<style>
	.scene-container {
		width: 100%;
		height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
</style>
