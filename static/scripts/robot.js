import * as THREE from "three";

import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export let container,
  stats,
  clock,
  gui,
  mixer,
  actions,
  activeAction,
  previousAction;
let camera, scene, renderer, model, face, width, height;

export const api = { state: "Walking" };

init();
animate();

function init() {
  container = document.createElement("div");
  container.className = "flex-child";
  const userPanel = document.getElementById("container_1");
  userPanel.appendChild(container);
  const flexChild = document.querySelector(".flex-child");
  width = flexChild.clientWidth;
  height = flexChild.clientHeight;

  camera = new THREE.PerspectiveCamera(45, width / height, 0.25, 100);
  camera.position.set(-5, 3, 10);
  camera.lookAt(0, 2, 0);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  // scene.fog = new THREE.Fog( 0xe0e0e0, 20, 100 );

  clock = new THREE.Clock();

  // lights

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 2);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
  dirLight.position.set(0, 20, 10);
  scene.add(dirLight);

  // ground

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2000, 2000),
    new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false })
  );
  mesh.rotation.x = -Math.PI / 2;
  scene.add(mesh);

  const grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  scene.add(grid);

  // model

  const loader = new GLTFLoader();
  loader.load(
    "static/models/RobotExpressive.glb",
    function (gltf) {
      model = gltf.scene;
      scene.add(model);

      createGUI(model, gltf.animations);
    },
    undefined,
    function (e) {
      console.error(e);
    }
  );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize);

  // stats
  stats = new Stats();
  container.appendChild(stats.dom);
}

function createGUI(model, animations) {
  gui = new GUI();
  mixer = new THREE.AnimationMixer(model);
  actions = {};

  addNewAnimations(mixer, animations);

  //getNewAnimations("static/models/XBot.glb", (otherModelAnimations, otherMixer) => {
  //    addNewAnimations(otherMixer, otherModelAnimations);
  //    createStatesGUI(); // Re-initialize states GUI after adding new animations.
  //});

  createStatesGUI();
  mixer.addEventListener("finished", restoreState);

  face = model.getObjectByName("Head_4");
  const expressions = Object.keys(face.morphTargetDictionary);
  const expressionFolder = gui.addFolder("Expressions");

  for (let i = 0; i < expressions.length; i++) {
    expressionFolder
      .add(face.morphTargetInfluences, i, 0, 1, 0.01)
      .name(expressions[i]);
  }

  activeAction = actions["Walking"];
  activeAction.play();

  expressionFolder.open();
  gui.close();
}

export function fadeToAction(name, duration) {
  console.log("fadeToAction: ", name);
  previousAction = activeAction;
  activeAction = actions[name];

  if (previousAction !== activeAction) {
    previousAction.fadeOut(duration);
  }

  activeAction
    .reset()
    .setEffectiveTimeScale(1)
    .setEffectiveWeight(1)
    .fadeIn(duration)
    .play();
}

function onWindowResize() {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}

function animate() {
  const dt = clock.getDelta();

  if (mixer) mixer.update(dt);

  requestAnimationFrame(animate);

  renderer.render(scene, camera);

  stats.update();
}

function createStatesGUI() {
  for (var i = 0; i < gui.folders.length; i++) {
    console.log(gui.folders[i]._title);
    if (gui.folders[i]._title == "States") {
      gui.folders[i].hide();
    }
  }

  const statesFolder = gui.addFolder("States");
  const clipCtrl = statesFolder.add(api, "state").options(Object.keys(actions));

  clipCtrl.onChange(function () {
    fadeToAction(api.state, 0.5);
    // mixer.addEventListener( 'finished', restoreState );
  });

  statesFolder.open();
}

function restoreState() {
  mixer.removeEventListener("finished", restoreState);
  fadeToAction(api.state, 0.2);
}

function getNewAnimations(modelURL, callback) {
  const loader = new GLTFLoader();
  loader.load(
    modelURL,
    (gltf) => {
      // Create a new mixer for the imported model's animations.
      const newMixer = new THREE.AnimationMixer(gltf.scene);
      // Add animations to this new mixer.
      addNewAnimations(newMixer, gltf.animations);
      // Call the callback function with the loaded animations.
      callback(gltf.animations, newMixer);
    },
    undefined, // onProgress callback, can be undefined if not needed.
    (error) => {
      console.error("An error occurred while loading the model:", error);
    }
  );
}

function addNewAnimations(mixer, animations) {
  // Combine animations from the current model and the other model
  // const combinedAnimations = animations.concat(otherModelAnimations);

  for (let i = 0; i < animations.length; i++) {
    const clip = animations[i].clone();
    const action = mixer.clipAction(clip);
    actions[clip.name] = action;
    // console.log("Add new action:", clip.name);

    // Uncomment and modify as necessary for special loop or play conditions
    // if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
    // action.clampWhenFinished = true;
    // action.loop = THREE.LoopOnce;
    // }
  }

  console.log(Object.keys(actions));
  // post all the commands to the database
  // const response = fetch('/admin/initiate_web', {
  //     method: 'POST',
  //     headers: {
  //         'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //         "commands": Object.keys(actions)
  //     }
  //     )
  // });
}

GUI.prototype.hide = function () {
  this.domElement.style.display = "none";
};
GUI.prototype.show = function () {
  this.domElement.style.display = "";
};
