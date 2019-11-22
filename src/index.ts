import * as Three from "three";
import { OrbitControls } from "three-orbitcontrols-ts";

export class Renderer {
  renderer: Three.WebGLRenderer;
  scene: Three.Scene;
  camera: Three.Camera;

  _focus: Three.Mesh;

  constructor(canvas: HTMLCanvasElement) {
    this.setupScene(canvas);
    this.createGrid();
    this.animate();

    this.camera.lookAt(this._focus.position);
  }

  setupScene(canvas: HTMLCanvasElement) {
    const { width, height } = canvas.getBoundingClientRect();
    this.scene = new Three.Scene();

    const camera = new Three.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.y = -5;
    camera.position.z = 1.5;
    this.camera = camera;

    const renderer = new Three.WebGLRenderer({ canvas });
    renderer.setSize(width, height);
    const backgroundColor = new Three.Color("#fff");

    renderer.setClearColor(backgroundColor, 1);

    this.renderer = renderer;

    new OrbitControls(camera, renderer.domElement);
  }

  createGrid() {
    const geometry = new Three.BoxGeometry(1, 1, 1);
    const material = new Three.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new Three.Mesh(geometry, material);
    this.scene.add(cube);
    this._focus = cube;

    this.camera.position.z = 5;

    const g2 = new Three.PlaneGeometry(60, 60, 9, 9);

    const m2 = new Three.MeshPhongMaterial({
      color: 0x00ff00,
      wireframe: true
    });

    const plane = new Three.Mesh(g2, m2);
    this.scene.add(plane);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.renderer.render(this.scene, this.camera);
  }
}

const renderer = new Renderer(document.querySelector("canvas.main"));

export default renderer;
