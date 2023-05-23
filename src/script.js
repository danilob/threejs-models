import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {Pane} from 'tweakpane';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const PARAMS = {
    visible: false,
    checkVisible: () => {
        if (PARAMS.visible){
            hemisphereLightHelper.visible = true == hemisphereLight.visible 
            directionalLightHelper.visible = true  == directionalLight.visible
            pointLightHelper.visible = true == pointLight.visible
            spotLightHelper.visible = true == spotLight.visible
            rectAreaLightHelper.visible = true == rectAreaLight.visible
        }
    },
    visibleLightHelper: () => {
        if (PARAMS.visible){
            hemisphereLightHelper.visible = true == hemisphereLight.visible 
            directionalLightHelper.visible = true  == directionalLight.visible
            pointLightHelper.visible = true == pointLight.visible
            spotLightHelper.visible = true == spotLight.visible
            rectAreaLightHelper.visible = true == rectAreaLight.visible
        }else{
            hemisphereLightHelper.visible = false    
            directionalLightHelper.visible = false  
            pointLightHelper.visible = false
            spotLightHelper.visible = false
            rectAreaLightHelper.visible = false
        }
        
    },
    download: () => {
        const link = document.createElement('a');
        link.download = 'download.png';
        link.href = document.getElementById("myCanvas").toDataURL('image/png');
        link.click()  
    }
  };

const pane = new Pane();

pane.addButton({
    title: 'download'
}).on("click",PARAMS.download)

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
 */
let mixer = null
const gltfLoader = new GLTFLoader()
gltfLoader.load(
    '/models/Fox/glTF/Fox.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(0.015,0.015,0.015)
        gltf.scene.position.set(0,-0.65,0)
        scene.add(gltf.scene)
        mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[2])
        action.play()
        console.log(gltf)
        gltf.scene.traverse( function( node ) {

            if ( node.isMesh ) { node.castShadow = true; }
        
        } );
    }
)
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)
pane.addInput(ambientLight, "intensity", {
    label: "amb. level",
    min: 0,
    max: 1,
    step: 0.001
})

pane.addInput(PARAMS, "visible",{
    label: "show helpers"
}).on("change",(ev)=>{
    PARAMS.visibleLightHelper()
})

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)
directionalLight.visible = true
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.near = 3
directionalLight.shadow.camera.far = 11
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightCameraHelper)
directionalLightCameraHelper.visible = false

pane.addInput(directionalLight,"visible",{
    "label": "luz direcional",
}).on("change",(ev)=>{
    PARAMS.checkVisible()
})

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
scene.add(hemisphereLight)
hemisphereLight.visible = false
pane.addInput(hemisphereLight,"visible",{
    "label": "luz hemisphere",
}).on("change",(ev)=>{
    PARAMS.checkVisible()
})

const pointLight = new THREE.PointLight(0xff9000, 0.5)
pointLight.position.set(1, 1, 1)
scene.add(pointLight)
pointLight.visible = false
pointLight.castShadow = true
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024

pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 8

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
scene.add(pointLightCameraHelper)
pointLightCameraHelper.visible = false

pane.addInput(pointLight,"visible",{
    "label": "luz pontual",
}).on("change",(ev)=>{
    PARAMS.checkVisible()
})

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1)
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)

rectAreaLight.visible = false
pane.addInput(rectAreaLight,"visible",{
    "label": "luz area",
}).on("change",(ev)=>{
    PARAMS.checkVisible()
})

const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
spotLight.target.position.x = -0.75
scene.add(spotLight.target)
scene.add(spotLight)

spotLight.visible = false
spotLight.castShadow = true
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.fov = 35
spotLight.shadow.camera.near = 2
spotLight.shadow.camera.far = 7


const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(spotLightCameraHelper)
spotLightCameraHelper.visible = false



pane.addInput(spotLight,"visible",{
    "label": "luz spot",
}).on("change",(ev)=>{
    PARAMS.checkVisible()
})
/** 
 * Helpers
 */

const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)
hemisphereLightHelper.visible = false

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)
directionalLightHelper.visible = false


const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)
pointLightHelper.visible = false


const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)
spotLightHelper.visible = false

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)
rectAreaLightHelper.visible = false
/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65
plane.receiveShadow = true


scene.add(plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 4
camera.position.z = 9
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    preserveDrawingBuffer: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    if(mixer!==null)
    {
        mixer.update(deltaTime)
    }
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()