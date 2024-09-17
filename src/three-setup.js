import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { lightValues } from './values';
import { setupFPSControls } from './cameraControls';
import { getModel2Url } from './loadModels';

// Setup
export function initThreeScene(){
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 24.58551523738378, 137.12110667939183);

var loading = true;

//renderer.render(scene, camera);

//const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight),0.2, 0.4, 0.45)
//composer.addPass(bloomPass);

// Torus

const geometry = new THREE.TorusGeometry(8, 3,16, 60);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);
torus.position.setX(20)
torus.position.setY(40) 

const plight = new THREE.PointLight(0xffffff,40);
plight.position.setY(80);
scene.add(plight);
//scene.add(torus)


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

// Load enviroment HDRI....



const controls = new OrbitControls(camera,renderer.domElement);

// LOAD 3d objects...
const loader = new GLTFLoader();
    loader.load(
      '/models/3dGallery.glb',
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(10,10,10);
        model.name = 'Gallery';
        scene.add(model);
        // update model to look reflective..
        model.traverse((child) => {
          if (child.isMesh) {
              // Make it shiny
              child.material.roughness = 0.2;
          }
        });
      },
      undefined,
      (error) => {
        console.error('An error occurred while loading the GLTF model:', error);
      }
    );
const ur = "./models/donut.glb"; 
const loader2 = new GLTFLoader();
  loader2.load(
    ur,
    (gltf) => {
      const model = gltf.scene;
      model.scale.set(8,8,8);
      model.position.setY(40);
      model.name = 'Donut';  

      scene.add(model);
      // update model to look reflective..
      model.traverse((child) => {
        if (child.isMesh) {
          //child.material.metalness = 0.2;    // Make the material metallic
          //child.material.roughness = 0.5;  // Make it shiny
          child.material.envMapIntensity = 0.3; // Apply environment map for reflection
          child.material.needsUpdate = true;
        }
      });
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

// FPS controls setup
const { controlz, moveCamera } = setupFPSControls(camera, renderer);

// Animation Loop

function animate() {
  requestAnimationFrame(animate);
  //if(scene.children[2]){scene.children[2].rotation.y += 0.004;}
  torus.rotation.y += 0.01
  if(scene.children[12]) {
    scene.children[12].children[10].power = 170750;
    //console.log(scene.children[12].children[10].power);
    scene.children[11].rotation.y += 0.01;  
    loading = false;
    
  } 
  if(loading){
    let rend = document.getElementById('bg');
    rend.style.display = 'none';
  }else{
    let rend = document.getElementById('bg');
    rend.style.display = 'block';
  }
  //controls.update();
  //console.log(camera.position);
  // controls.update();
  const deltaTime = 0.05; // Adjust this value for movement speed
  moveCamera(deltaTime);

  controlz.update();
 
  renderer.render(scene, camera); 
  

}

animate();


}