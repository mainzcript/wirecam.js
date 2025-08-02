<script lang="ts">
	import { W } from '$lib/components/wirecam';
	import * as THREE from 'three';
</script>

<W.Root debug={true}>
	<div class="relative isolate">
		<div class="fixed -z-10 h-screen w-screen">
			<W.Canvas />
		</div>
		<W.Content>
			<!-- HTML content rendered as overlay -->
			<section class="relative flex min-h-screen items-center justify-center">
				<W.Keyframe
					options={{
						cameraPos: new THREE.Vector3(0, 2, 20),
						worldTargetPos: new THREE.Vector3(0, 2, 0),
						worldTargetRadius: 6
					}}
					class="absolute inset-0"
				></W.Keyframe>
				<div class="relative z-10 text-center">
					<div
						class="mx-auto max-w-4xl rounded-lg border-2 border-white/30 bg-black/20 p-8 backdrop-blur-md"
					>
						<h1 class="m-0 mb-4 text-5xl font-bold text-white">Welcome to Wirecam.js</h1>
						<p class="m-0 mb-6 text-xl leading-relaxed text-white/80">
							Experience the magic of scroll-driven 3D camera control using Threlte. Scroll down to
							explore each geometric wonder up close.
						</p>
						<div class="flex items-center justify-center gap-2 text-white/60">
							<svg
								class="h-6 w-6 animate-bounce"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 14l-7 7m0 0l-7-7m7 7V3"
								></path>
							</svg>
							<span class="text-sm">Scroll to explore</span>
						</div>
					</div>
				</div>
			</section>

			<section>
				<div class="container mx-auto grid min-h-screen grid-cols-2 gap-4 py-20">
					<div class="order-1 flex items-center justify-center">
						<div
							class="mx-auto max-w-3xl rounded-lg border-2 border-white/30 bg-black/20 p-6 backdrop-blur-md"
						>
							<h2 class="m-0 mb-2.5 text-center text-2xl text-white">The Red Cube</h2>
							<p class="m-0 text-center leading-relaxed text-white/80">
								Watch as the camera gracefully swoops in to showcase this vibrant red cube. Perfect
								angles, perfect lighting - every detail matters in 3D storytelling.
							</p>
						</div>
					</div>
					<W.Keyframe
						options={{
							cameraPos: new THREE.Vector3(-4, 3, 5),
							worldTargetPos: new THREE.Vector3(-4, 0, 0),
							worldTargetRadius: 1.25
						}}
						class="order-2"
					></W.Keyframe>
				</div>
			</section>

			<section>
				<div class="container mx-auto grid min-h-screen grid-cols-2 gap-4 py-20">
					<div class="order-2 flex items-center justify-center">
						<div
							class="mx-auto max-w-3xl rounded-lg border-2 border-white/30 bg-black/20 p-6 backdrop-blur-md"
						>
							<h2 class="m-0 mb-2.5 text-center text-2xl text-white">The Teal Sphere</h2>
							<p class="m-0 text-center leading-relaxed text-white/80">
								Behold the mesmerizing teal sphere - a perfect example of geometric beauty. The
								camera dances around it, revealing its smooth, flawless surface from every angle.
							</p>
						</div>
					</div>
					<W.Keyframe
						options={{
							cameraPos: new THREE.Vector3(0, 3, 5),
							worldTargetPos: new THREE.Vector3(0, 0, 0),
							worldTargetRadius: 1.5
						}}
						class="order-1"
					></W.Keyframe>
				</div>
			</section>

			<section>
				<div class="container mx-auto grid min-h-screen grid-cols-2 gap-4 py-20">
					<div class="order-1 flex items-center justify-center">
						<div
							class="mx-auto max-w-3xl rounded-lg border-2 border-white/30 bg-black/20 p-6 backdrop-blur-md"
						>
							<h2 class="m-0 mb-2.5 text-center text-2xl text-white">The Blue Cylinder</h2>
							<p class="m-0 text-center leading-relaxed text-white/80">
								Meet the elegant blue cylinder - standing tall and proud. The camera captures its
								majestic height and perfect proportions with cinematic precision.
							</p>
						</div>
					</div>
					<W.Keyframe
						options={{
							cameraPos: new THREE.Vector3(4, 3, 5),
							worldTargetPos: new THREE.Vector3(4, 0, 0),
							worldTargetRadius: 1.5
						}}
						class="order-2"
					></W.Keyframe>
				</div>
			</section>

			<section>
				<div class="container mx-auto grid min-h-screen grid-cols-2 gap-4 py-20">
					<div class="order-2 flex items-center justify-center">
						<div
							class="mx-auto max-w-3xl rounded-lg border-2 border-white/30 bg-black/20 p-6 backdrop-blur-md"
						>
							<h2 class="m-0 mb-2.5 text-center text-2xl text-white">The Green Torus</h2>
							<p class="m-0 text-center leading-relaxed text-white/80">
								The mysterious green torus - a donut-shaped wonder floating in space. The camera
								orbits around this unique form, showcasing its infinite curves and organic flow.
							</p>
						</div>
					</div>
					<W.Keyframe
						options={{
							cameraPos: new THREE.Vector3(0, 7, 5),
							worldTargetPos: new THREE.Vector3(0, 4, 0),
							worldTargetRadius: 2
						}}
						class="order-1"
					></W.Keyframe>
				</div>
			</section>
		</W.Content>
	</div>
</W.Root>
