import './style.css'
import * as THREE from 'three'
import { addGroundMesh } from './addDefaultMeshes'
import { addLight } from './addDefaultLights'
import Model from './Model'
import { createSkybox, HDRI } from './environment'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { addTrack } from './addTrack'
import { gsap } from'gsap'

const params = {
	exposure: 0
}

const renderer = new THREE.WebGLRenderer({antialias: true})

const clock = new THREE.Clock()

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)

const mixers = []

const meshes = {}

const lights = {}

const timeline = new gsap.timeline({paused: true})
const controls = new OrbitControls(camera, renderer.domElement)


const scrollSpeed = 0.1
let maxScrollProgress = 600
const totalDuration = maxScrollProgress / scrollSpeed
let scrollProgress = 0
let targetProgress = 0
let scrollVelocity = 0
const friction = 0.85
const acceleration = 0.000007
const maxVelocity = 0.002
const spring = 0.00001
const debug = document.querySelector('.scrollPosition')

const scene = new THREE.Scene()
const cameraTarget = new THREE.Vector3()

scene.fog = new THREE.FogExp2( 0xcccccc, 0.003 );

let timewarp02
let loadedFlag = false

const clamp = (num, min, max) => Math.min(Math.max(num, min), max)
init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	meshes.ground = addGroundMesh()
	meshes.track = addTrack().track
	meshes.debug = addTrack().debug

	lights.default = addLight()

	scene.add(lights.default)
	scene.add(meshes.ground)
	scene.add(meshes.track)
	scene.add(meshes.debug)


	//meshes.ground.position.set(0, 0, 0)
	//meshes.ground.rotation.x = - Math.PI / 2 

	//camera.position.set(40, 12, 6)
	//camera.lookAt(0, 1, 3)

	scene.background = HDRI()
	scene.environment = HDRI()
	createSkybox(scene)
	instances()
	resize()
	handleScroll()
	animate()
}

function initTimeline() {
	const initialLookAtPosition = new THREE.Vector3(-17, 18.3, -10.5)
	const fireLookAtPosition = new THREE.Vector3(7, 0.1, -1.5)
	const wormHoleLookAtPosition = new THREE.Vector3(-3, -17, -13)


	timeline.set(cameraTarget, {
		x: initialLookAtPosition.x,
		y: initialLookAtPosition.y,
		z: initialLookAtPosition.z
	  }, 0)

	timeline.to(cameraTarget, {
		x: fireLookAtPosition.x,
		y: fireLookAtPosition.y,
		z: fireLookAtPosition.z,
		duration: totalDuration * 0.05,
		ease: 'power1.inOut'
	},
	0.1 * totalDuration)

	timeline.to(cameraTarget, {
		x: wormHoleLookAtPosition.x,
		y: wormHoleLookAtPosition.y,
		z: wormHoleLookAtPosition.z,
		duration: totalDuration * 0.2,
		ease: 'power2.inOut'
	},
	0.80 * totalDuration)

}

function updateCamera(scrollProgress) {
	const position = meshes.track.geometry.parameters.path.getPointAt(
		scrollProgress
	)
	camera.position.copy(position)
	
	camera.lookAt(cameraTarget)
}



function handleScroll() {
	window.addEventListener('wheel', (event)=>{
		const scrollDelta = event.deltaY || event.wheelDelta
		
		scrollVelocity += scrollDelta * acceleration
		scrollVelocity = Math.max(
			Math.min(scrollVelocity, maxVelocity), 
			-maxVelocity
		)
		targetProgress += scrollDelta * 0.01
		targetProgress = Math.max(
			0,
			Math.min(targetProgress, maxScrollProgress)
		)
	})
}

function instances() {
	const bonfire = new Model({
		name: 'bonfire',
		scene: scene,
		meshes: meshes,
		url: 'bonfire.glb',
		scale: new THREE.Vector3(3.5, 3.5, 3.5),
		position: new THREE.Vector3(25, 0.1, -3.5),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})	
	const drum01 = new Model({
		name: 'drum01',
		scene: scene,
		meshes: meshes,
		url: 'african_drum_1.glb',
		scale: new THREE.Vector3(0.6, 0.6, 0.6),
		position: new THREE.Vector3(0.4, 0.7, 4),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})
	const drum02 = new Model({
		name: 'drum02',
		scene: scene,
		meshes: meshes,
		url: 'african_drum_2.glb',
		scale: new THREE.Vector3(0.12, 0.12, 0.12),
		position: new THREE.Vector3(4.5, -0.2, 5),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})	
	const drum03 = new Model({
		name: 'drum03',
		scene: scene,
		meshes: meshes,
		url: 'african_drum_raw_scan.glb',
		scale: new THREE.Vector3(0.7, 0.7, 0.7),
		position: new THREE.Vector3(8.4, 2.8, 5.5),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})
	const drum04 = new Model({
		name: 'drum04',
		scene: scene,
		meshes: meshes,
		url: 'darbuka_drum.glb',
		scale: new THREE.Vector3(1.5, 1.5, 1.5),
		position: new THREE.Vector3(12, 0, 3.5),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})
	const drum05 = new Model({
		name: 'drum05',
		scene: scene,
		meshes: meshes,
		url: 'djembe_-_african_drum_-_scan.glb',
		scale: new THREE.Vector3(5.5, 5.5, 5.5),
		position: new THREE.Vector3 (-2, 0, 0),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})
	const drum06 = new Model({
		name: 'drum06',
		scene: scene,
		meshes: meshes,
		url: 'drum_roll.glb',
		scale: new THREE.Vector3(1.5, 1.5, 1.5),
		position: new THREE.Vector3(-2, -0.4, -3.7),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})
	const drum07 = new Model({
		name: 'drum07',
		scene: scene,
		meshes: meshes,
		url: 'drum.glb',
		scale: new THREE.Vector3(5, 5, 5),
		position: new THREE.Vector3(0, -0.3, -7.1),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})
	const drum08 = new Model({
		name: 'drum08',
		scene: scene,
		meshes: meshes,
		url: 'kcisa-drum.glb',
		scale: new THREE.Vector3(0.5, 0.5, 0.5),
		position: new THREE.Vector3(3.5, 0.7, -9.5),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})
	const drum09 = new Model({
		name: 'drum09',
		scene: scene,
		meshes: meshes,
		url: 'traditional_drum.glb',
		scale: new THREE.Vector3(0.8, 0.8, 0.8),
		position: new THREE.Vector3(7, 1.2, -9.5),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})
	const drum10 = new Model({
		name: 'drum10',
		scene: scene,
		meshes: meshes,
		url: 'tribal_drum_free.glb',
		scale: new THREE.Vector3(0.03, 0.03, 0.03),
		position: new THREE.Vector3 (11, 0.6, -8),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})
	const drum11 = new Model({
		name: 'drum11',
		scene: scene,
		meshes: meshes,
		url: 'zulu_drum.glb',
		scale: new THREE.Vector3(1.5, 1.5, 1.5),
		position: new THREE.Vector3(14, 1.3, 0),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})
	const drum12 = new Model({
		name: 'drum12',
		scene: scene,
		meshes: meshes,
		url: 'african_drum.glb',
		scale: new THREE.Vector3(0.8, 0.8, 0.8),
		position: new THREE.Vector3(13.5, 0, -4),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})
	const timewarp01 = new Model({
		name: 'timewarp01',
		scene: scene,
		meshes: meshes,
		url: 'spacevortex.glb',
		scale: new THREE.Vector3(0.8, 0.8, 0.8),
		position: new THREE.Vector3(7, -0.1, -1.2),
		rotation: new THREE.Vector3(Math.PI/  2, 0, 0),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})
	timewarp02 = new Model({
		name: 'timewarp02',
		scene: scene,
		meshes: meshes,
		url: 'free_tunnel_wormhole_space_fly_effect_loop.glb',
		scale: new THREE.Vector3(1, 1, 1),
		position: new THREE.Vector3(2, -16, -2),
		//rotation: new THREE.Vector3((-Math.PI / 2), 0, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const timewarpInstrument01 = new Model({
		name: 'timewarpInstrument01',
		scene: scene,
		meshes: meshes,
		url: 'flute_en_os.glb',
		scale: new THREE.Vector3(0.05, 0.05, 0.05),
		position: new THREE.Vector3(2, -16, -2),
		rotation: new THREE.Vector3((-Math.PI / 2), 0, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const timewarpInstrument02 = new Model({
		name: 'timewarpInstrument02',
		scene: scene,
		meshes: meshes,
		url: 'maori_nguru_nose_flute.glb',
		scale: new THREE.Vector3(1, 1, 1),
		position: new THREE.Vector3(2, -20, -2),
		rotation: new THREE.Vector3((-Math.PI / 2), 0, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const timewarpInstrument03 = new Model({
		name: 'timewarpInstrument03',
		scene: scene,
		meshes: meshes,
		url: 'ocarina.glb',
		scale: new THREE.Vector3(0.3, 0.3, 0.3),
		position: new THREE.Vector3(2, -20, -2),
		rotation: new THREE.Vector3((-Math.PI / 2), 0, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const timewarpInstrument04 = new Model({
		name: 'timewarpInstrument04',
		scene: scene,
		meshes: meshes,
		url: 'putto.glb',
		scale: new THREE.Vector3(5, 5, 5),
		position: new THREE.Vector3(2, -18, -2),
		rotation: new THREE.Vector3(0, Math.PI, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const timewarpInstrument05 = new Model({
		name: 'timewarpInstrument05',
		scene: scene,
		meshes: meshes,
		url: 'sanza_a_musical_instrument.glb',
		scale: new THREE.Vector3(0.15, 0.15, 0.15),
		position: new THREE.Vector3(1, -18, -2),
		rotation: new THREE.Vector3(0, Math.PI, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const timewarpInstrument06 = new Model({
		name: 'timewarpInstrument06',
		scene: scene,
		meshes: meshes,
		url: 'viking_horn.glb',
		scale: new THREE.Vector3(20, 20, 20),
		position: new THREE.Vector3(0, -18, -1),
		rotation: new THREE.Vector3(0, Math.PI, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	bonfire.init()
	drum01.init()
	drum02.init()
	drum03.init()
	drum04.init()
	drum05.init()
	drum06.init()
	drum07.init()
	drum08.init()
	drum09.init()
	drum10.init()
	drum11.init()
	drum12.init()
	timewarp01.init()
	timewarp02.init()
	timewarpInstrument01.init()
	timewarpInstrument02.init()
	timewarpInstrument03.init()
	timewarpInstrument04.init()
	timewarpInstrument05.init()
	timewarpInstrument06.init()

}
function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}
console.log(Math.clamp)

function animate() {
	const delta = clock.getDelta()
	requestAnimationFrame(animate)

    //controls.update()

	for (const mixer of mixers) {
		mixer.update(delta)
	}

	if(!loadedFlag){
		if(meshes.bonfire && meshes.timewarp02) {
			loadedFlag = true
			initTimeline()
		}
	}
	const distance = targetProgress - scrollProgress
	scrollVelocity += distance * spring
	scrollVelocity *= friction
	scrollProgress += scrollVelocity

	scrollProgress = Math.max(0, Math.min(scrollProgress, maxScrollProgress))
	targetProgress = Math.max(0, Math.min(targetProgress, maxScrollProgress))

	const progress = scrollProgress / maxScrollProgress
	const time = progress * totalDuration
	
	timeline.seek(time)
	debug.innerHTML = `Progress: ${scrollProgress.toFixed(3)}, Velocity: ${scrollVelocity.toFixed(3)}`
	
	if(Math.abs(scrollVelocity) < 0.0001) {
		scrollVelocity = 0
	}

	console.log(scrollProgress)
	updateCamera(scrollProgress)
	renderer.render(scene, camera)
}
