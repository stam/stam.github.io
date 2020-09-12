import * as Three from "three";
import { Perlin } from "libnoise-ts/module/generator";

const WIDTH = 50;
const HEIGHT = 40;

let X_OFFSET = 0.201;
let Y_OFFSET = 0.101;

const noiseGen = new Perlin();

export class Renderer {
  renderer: Three.WebGLRenderer;
  scene: Three.Scene;
  camera: Three.PerspectiveCamera;

  _grid: Three.Mesh;

  constructor(canvas: HTMLCanvasElement) {
    this.setupScene(canvas);
    this.createGrid();
    this.animate();
  }

  setupScene(canvas: HTMLCanvasElement) {
    const { width, height } = canvas.getBoundingClientRect();
    this.scene = new Three.Scene();

    const camera = new Three.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.y = -15;
    camera.position.z = 10;
    this.camera = camera;
    camera.lookAt(this.scene.position);

    const renderer = new Three.WebGLRenderer({
      antialias: true,
      canvas,
    });
    renderer.setSize(width, height);
    const backgroundColor = new Three.Color("#000");

    renderer.setClearColor(backgroundColor, 0);

    this.renderer = renderer;
  }

  createGrid() {
    const plane = new Three.PlaneGeometry(200, 100, WIDTH, HEIGHT);

    const gridMaterial = new Three.ShaderMaterial({
      vertexShader: document.getElementById("vertexShader").textContent,
      fragmentShader: document.getElementById("fragmentShader").textContent,
    });
    this._grid = new Three.Mesh(plane, gridMaterial);

    this.scene.add(this._grid);
  }

  setZ() {
    const plane = this._grid.geometry as Three.Geometry;
    plane.verticesNeedUpdate = true;

    for (let row = 0; row < HEIGHT; row++) {
      for (let col = 0; col < WIDTH; col++) {
        const index = col + row * (WIDTH + 1);
        // X_OFFSET += 0.004;

        const { x, y } = plane.vertices[index];
        const noiseValue = noiseGen.getValue(x / 30, Y_OFFSET + y / 20, 0) * 3;
        plane.vertices[index].z = noiseValue;
      }
      Y_OFFSET += 0.001;
    }
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.setZ();

    this.renderer.render(this.scene, this.camera);
  }

  handleResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };
}

const renderer = new Renderer(document.querySelector("canvas.main"));

window.addEventListener("resize", renderer.handleResize, false);

export default renderer;
