import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RectAreaLightHelper, UnrealBloomPass } from 'three/examples/jsm/Addons.js';
import { EffectComposer } from 'three/examples/jsm/Addons.js';
import { RenderPass } from 'three/examples/jsm/Addons.js';
import {lightValues} from '../../src/values'

// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 26.18551523738378, 137.12110667939183);


//renderer.render(scene, camera);
const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight),0.2, 0.4, 0.45)
//composer.addPass(bloomPass);

// Torus

const geometry = new THREE.TorusGeometry(8, 3,16, 60);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);
torus.position.setX(20)
torus.position.setY(40) 
scene.add(torus)


// Lights 
function createRectAreaLights(scene, lightArry){
  lightArry.forEach(lightData => {
    const { position, rotation,color=0xffffff,intensity=10,width=45,height=4 } = lightData;

    //create rectlight
    const rectLight = new THREE.RectAreaLight(color, intensity, width, height);
    rectLight.position.set(position[0],position[1],position[2]);
    rectLight.rotation.set(rotation[0],rotation[1],rotation[2]);
    scene.add(rectLight);
  })
}
//10,45,4
const ominiDirectionalLight = new THREE.AmbientLight(0xffffff,1);

// Add lights to scene
scene.add(
  ominiDirectionalLight
);
createRectAreaLights(scene,lightValues);


const controls = new OrbitControls(camera,renderer.domElement);

// Helpers
const loader = new GLTFLoader();
    loader.load(
      '/models/3dGallery.glb',
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(10,10,10);
        model.name = 'Gallery';
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error('An error occurred while loading the GLTF model:', error);
      }
    );

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);
const drum = scene.children
console.log(drum);

// Animation Loop

function animate() {
  requestAnimationFrame(animate);
  //if(scene.children[2]){scene.children[2].rotation.y += 0.004;}
  torus.rotation.y += 0.01
  //controls.update();
  //console.log(camera.position);
  // controls.update();
 
  //renderer.render(scene, camera); 
  composer.render();
}

animate();


//add movement controls..
document.addEventListener('keypress',(ev)=>{
  let currentZ = camera.position.z;
  let currentY = camera.rotation.y;
  if(ev.key == ' '){
    let currentCamPosition = camera.position;
    console.log(currentCamPosition);
    //x: 117.00753477626863, y: 41.26668095626776, z: 23.25959911520694
    //camera.position.set()
  }else if(ev.key == 'w'){
    camera.position.setZ(currentZ - 1);
  }else if(ev.key == 's'){
    camera.position.setZ(currentZ + 1);
  }else if(ev.key == 'a'){
    const v3 = new THREE.Vector3(0,1,0);
    camera.rotateOnWorldAxis(v3,2);
  }
  console.log(ev.key);
  //console.log(lightValues);
})
