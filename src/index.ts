import * as Three from "three";
import FastSimplexNoise from "fast-simplex-noise";
// import { OrbitControls } from "three-orbitcontrols-ts";

const WIDTH = 50;
const HEIGHT = 40;

let X_OFFSET = 0;
let Y_OFFSET = 0;

const noiseGen = new FastSimplexNoise({
  frequency: 0.1,
  max: 2,
  min: -1,
  octaves: 2
});

export class Renderer {
  renderer: Three.WebGLRenderer;
  scene: Three.Scene;
  camera: Three.Camera;

  _plane: Three.Geometry;
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
      canvas
    });
    renderer.setSize(width, height);
    const backgroundColor = new Three.Color("#fff");

    renderer.setClearColor(backgroundColor, 1);

    this.renderer = renderer;
  }

  createGrid() {
    const geometry = new Three.BoxGeometry(1, 1, 1);
    const material = new Three.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new Three.Mesh(geometry, material);
    // this.scene.add(cube);

    const plane = new Three.PlaneGeometry(200, 100, WIDTH, HEIGHT);

    // const gridMaterial = new Three.MeshLambertMaterial();
    const gridMaterial = new Three.ShaderMaterial({
      vertexShader: document.getElementById("vertexShader").textContent,
      fragmentShader: document.getElementById("fragmentShader").textContent
    });
    this._grid = new Three.Mesh(plane, gridMaterial);
    // this._grid.wire;

    // this._grid = new Three.LineSegments(wireframeGeometry, lineMaterial);

    this.scene.add(this._grid);
  }

  setZ() {
    // const grid = this._grid;
    // grid.geometry
    const plane = this._grid.geometry as Three.Geometry;
    // const p = this._plane;
    plane.verticesNeedUpdate = true;

    console.log("l", plane.vertices.length);

    const noise = [];
    for (let x = 0; x < WIDTH; x++) {
      // noise[x] = [];
      for (let y = 0; y < HEIGHT; y++) {
        const index = x * HEIGHT + y;
        const n = noiseGen.scaled([y + Y_OFFSET, x + X_OFFSET]);
        // const n = noiseGen.scaled([x + X_OFFSET, y + Y_OFFSET]);
        noise[index] = `${n},${x},${y},${index}`;
        const v = plane.vertices[index];
        v.z = n;
      }
    }
    X_OFFSET += 0.1;
    // console.log(noise);

    // for (let i = 0; i < plane.vertices.length; i++) {
    //   const v = plane.vertices[i];
    //   v.z = Math.random();
    //   // console.log(v.z);
    // }
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.setZ();

    this.renderer.render(this.scene, this.camera);
  }
}

const renderer = new Renderer(document.querySelector("canvas.main"));

export default renderer;
