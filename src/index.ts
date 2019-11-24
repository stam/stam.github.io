import * as Three from "three";
// import { OrbitControls } from "three-orbitcontrols-ts";

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
    // this.camera.rotateX(Math.PI / 2.5);

    const renderer = new Three.WebGLRenderer({
      antialias: true,
      canvas
    });
    renderer.setSize(width, height);
    const backgroundColor = new Three.Color("#fff");

    renderer.setClearColor(backgroundColor, 1);

    this.renderer = renderer;

    // new OrbitControls(camera, renderer.domElement);
  }

  createGrid() {
    const geometry = new Three.BoxGeometry(1, 1, 1);
    const material = new Three.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new Three.Mesh(geometry, material);
    this.scene.add(cube);

    const plane = new Three.PlaneGeometry(200, 100, 50, 40);
    // const wireframeGeometry = new Three.WireframeGeometry(this._plane);

    // var lineMaterial = new Three.LineBasicMaterial({
    //   color: new Three.Color("#C429A8"),

    //   linewidth: 20
    // });

    const gridMaterial = new Three.MeshLambertMaterial();
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

    for (let i = 0; i < plane.vertices.length; i++) {
      const v = plane.vertices[i];
      v.z = Math.random();
      // console.log(v.z);
    }
  }

  animate() {
    // requestAnimationFrame(this.animate.bind(this));

    this.setZ();

    this.renderer.render(this.scene, this.camera);
  }
}

const renderer = new Renderer(document.querySelector("canvas.main"));

export default renderer;
