import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

export function setupFPSControls(camera, renderer) {
    // Add PointerLockControls to the camera
    const controlz = new PointerLockControls(camera, renderer.domElement);
    document.body.addEventListener('click', () => {
      controlz.lock(); // Lock pointer on click to enable movement
    });
  
    // Set movement speed and keys
    const movementSpeed = 40;
    const move = { forward: false, backward: false, left: false, right: false };
  
    //check curent location of camera...
    document.addEventListener('keypress',(ev) =>{
      //console.log(ev.key);
      if(ev.key == " "){
        console.log(camera.position);
      }
    })
    // x: -30.510787488700938 y:46.513984682533724

    // Add keyboard event listeners for movement
    document.addEventListener('keydown', (event) => {
      switch (event.code) {
        case 'KeyW': // Move forward
          move.forward = true;
          break;
        case 'KeyS': // Move backward
          move.backward = true;
          break;
        case 'KeyA': // Move left
          move.left = true;
          break;
        case 'KeyD': // Move right
          move.right = true;
          break;
      }
    });
  
    document.addEventListener('keyup', (event) => {
      switch (event.code) {
        case 'KeyW': // Stop moving forward
          move.forward = false;
          break;
        case 'KeyS': // Stop moving backward
          move.backward = false;
          break;
        case 'KeyA': // Stop moving left
          move.left = false;
          break;
        case 'KeyD': // Stop moving right
          move.right = false;
          break;
      }
    });
  
    // Update camera movement based on input
    function moveCamera(deltaTime) {
      const direction = new THREE.Vector3();
  
      if (move.forward) {
        if(camera.position.z < -128.629661363364 ){
          //console.log(camera.position.z)
          let possition = camera.position.z;
          console.log('At front or back wall!!')
          camera.position.z = possition + 20;
          
        }else{
          camera.getWorldDirection(direction);
          camera.position.add(direction.multiplyScalar(movementSpeed * deltaTime));
          camera.position.setY(44.58551523738378);
        }
      }
      if (move.backward) {
        //151.93708797511098
        if(camera.position.z > 151.93708797511098 ){
          //console.log(camera.position.z)
          let possition = camera.position.z;
          console.log('At front or back wall!!')
          camera.position.z = possition - 20;
          
        }else{
          camera.getWorldDirection(direction);
          camera.position.add(direction.multiplyScalar(-movementSpeed * deltaTime));
          camera.position.setY(44.58551523738378);
        }
        
      }
      if (move.left) {
        //-195.89336411911646
        if(camera.position.x < -195.89336411911646 ){
          //console.log(camera.position.z)
          let possition = camera.position.x;
          console.log('At left or right wall!!')
          camera.position.x = possition + 20;
          
        }else{
          camera.getWorldDirection(direction);
          direction.cross(camera.up);
          camera.position.add(direction.multiplyScalar(-movementSpeed * deltaTime));
          camera.position.setY(44.58551523738378);
        }
        
      }
      if (move.right) {
        //195.89336411911646
        if(camera.position.x > 195.89336411911646 ){
          //console.log(camera.position.z)
          let possition = camera.position.x;
          console.log('At left or right wall!!')
          camera.position.x = possition - 20;
          
        }else{
          camera.getWorldDirection(direction);
          direction.cross(camera.up);
          camera.position.add(direction.multiplyScalar(movementSpeed * deltaTime));
          camera.position.setY(44.58551523738378);
        }
        
      }
    }
  
    return { controlz, moveCamera };
  }
  

//add movement controls..
