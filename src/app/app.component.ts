import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CubeGeometry, Scene, PointLight, PerspectiveCamera, Vector3, BoxBufferGeometry, MeshBasicMaterial, Mesh, WebGLRenderer, PCFSoftShadowMap, Color, DoubleSide, Vector2, Geometry, Face3, Raycaster, ShaderMaterial, EdgesGeometry, LineSegments, Box3, Ray, BoxGeometry, Matrix4, Matrix3, SphereGeometry, CylinderGeometry, RingGeometry, TorusGeometry, Line3, Line } from 'three';
import "./js/EnableThreeExamples";
import "three/examples/js/controls/OrbitControls";
import { Geom } from './geometry';
import { Camera } from './camera';

declare var THREE;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  scene: Scene;

  camera: Camera;

  renderer: WebGLRenderer;

  controls: THREE.OrbitControls;

  geometries: Array<Geom>;

  lines: Array<Line>;

  colors: Array<Color>;

  @ViewChild('canvas') private canvasRef: ElementRef;

  constructor() {
    this.render = this.render.bind(this);
    this.renderControls = this.renderControls.bind(this);
    this.geometries = new Array();
    this.lines = new Array();
    this.colorsPalette();
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  ngOnInit() {
    this.scene = new Scene();

    this.loadCubes();

    this.loadSpheres();

    this.loadCilindres();

    this.loadTorus();

    //this.loadLines();
    
    this.createCamera();

    this.createLights();

    this.startRendering();

    this.addControls();
  }

  private createCamera() {
    this.camera = new Camera();
    this.camera.camera = new PerspectiveCamera(55.0, window.innerWidth / window.innerHeight, 0.5, 300000);
    this.camera.camera.position.set(0, 0, -100);
    this.camera.camera.lookAt(new Vector3());
  }

  private createLights() {
    var light = new PointLight(0xffffff, 1, 1000);
    light.position.set(0, 1000, 1000);
    this.scene.add(light);

    var light = new PointLight(0xffffff, 1, 1000);
    light.position.set(0, 1000, -1000);
    this.scene.add(light);
  }

  private loadCubes() {
    let color = 0;
    for(let x = 0; x < 5; x++) {
      this.createCube(Math.random()*10, Math.random()*100-50, Math.random()*100-50, Math.random()*100-50, color);
      color++;
      if(color > 2) {
        color = 0;
      }
    }
  }

  private loadSpheres() {
    let color = 0;
    for(let x = 0; x < 5; x++) {
      this.createSphere(Math.random()*10, Math.random()*100-50, Math.random()*100-50, Math.random()*100-50, color);
      color++;
      if(color > 2) {
        color = 0;
      }
    }
  }

  private loadCilindres() {
    let color = 0;
    for(let x = 0; x < 5; x++) {
      this.createCilindre(Math.random()*10, Math.random()*10, Math.random()*10, Math.random()*100-50, Math.random()*100-50, Math.random()*100-50, color);
      color++;
      if(color > 2) {
        color = 0;
      }
    }
  }

  private loadTorus() {
    let color = 0;
    for(let x = 0; x < 5; x++) {
      this.createTorus(Math.random()*10, Math.random()*2, Math.random()*100-50, Math.random()*100-50, Math.random()*100-50, color);
      color++;
      if(color > 2) {
        color = 0;
      }
    }
  }

  moveCamera() {

    if(!this.camera.dfRotateX) {
      this.camera.dfRotateX = Math.random()-0.5;
    }
    if(!this.camera.dfRotateY) {
      this.camera.dfRotateY = Math.random()-0.5;
    }
    if(!this.camera.dfRotateZ) {
      this.camera.dfRotateZ = Math.random()-0.5;
    }
    if(!this.camera.dfTranslateX) {
      this.camera.dfTranslateX = Math.random()-0.5;
    }
    if(!this.camera.dfTranslateY) {
      this.camera.dfTranslateY = Math.random()-0.5;
    }
    if(!this.camera.dfTranslateZ) {
      this.camera.dfTranslateZ = Math.random()-0.5;
    }
    
    this.camera.camera.rotateX(this.camera.dfRotateX/30);
    this.camera.camera.rotateY(this.camera.dfRotateY/30);
    this.camera.camera.rotateZ(this.camera.dfRotateZ/30);

    //console.log(this.camera.dfRotateX);

    this.camera.camera.translateX(this.camera.dfTranslateX/10);
    this.camera.camera.translateY(this.camera.dfTranslateY/10);
    this.camera.camera.translateZ(this.camera.dfTranslateZ/10);

    //console.log(this.camera.dfTranslateX);
  }

  moveCubes() {
    for(let geom of this.geometries) {
      if(geom.mesh) {
        if(!geom.dfRotateX) {
          geom.dfRotateX = Math.random()-0.5;
        }
        if(!geom.dfRotateY) {
          geom.dfRotateY = Math.random()-0.5;
        }
        if(!geom.dfRotateZ) {
          geom.dfRotateZ = Math.random()-0.5;
        }
        if(!geom.dfTranslateX) {
          geom.dfTranslateX = Math.random()-0.5;
        }
        if(!geom.dfTranslateY) {
          geom.dfTranslateY = Math.random()-0.5;
        }
        if(!geom.dfTranslateZ) {
          geom.dfTranslateZ = Math.random()-0.5;
        }
        
        if(geom.stopRotate == false) {
          //console.log("aa:" + cube.stopRotate);
          geom.mesh.rotateX(geom.dfRotateX/30);
          geom.mesh.rotateY(geom.dfRotateY/30);
          geom.mesh.rotateZ(geom.dfRotateZ/30);
          geom.line.rotateX(geom.dfRotateX/30);
          geom.line.rotateY(geom.dfRotateY/30);
          geom.line.rotateZ(geom.dfRotateZ/30);
        }
        if(geom.stopTranslate == false) {
          //console.log("aa:" + cube.stopTranslate);
          geom.mesh.translateX(geom.dfTranslateX/10);
          geom.mesh.translateY(geom.dfTranslateY/10);
          geom.mesh.translateZ(geom.dfTranslateZ/10);
          geom.line.translateX(geom.dfTranslateX/10);
          geom.line.translateY(geom.dfTranslateY/10);
          geom.line .translateZ(geom.dfTranslateZ/10);
        }
        //console.log(this.cubes[x].totalRotateX);
      }
    }
  }

  private createCube(size, translateX, translateY, translateZ, color) {
    let geometry = new BoxGeometry(size, size, size, 1, 1, 1);
    let material = new MeshBasicMaterial({
      color: this.colors[color],
      side: DoubleSide,
      transparent: true,
      opacity: 0.5
    });
    let mesh = new Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;
    mesh.translateX(translateX);
    mesh.translateY(translateY);
    mesh.translateZ(translateZ);
    this.scene.add(mesh);
    var line = new LineSegments( geometry, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
    line.rotation.x = Math.PI / 2;
    line.translateX(translateX);
    line.translateY(translateY);
    line.translateZ(translateZ);
    let cube = new Geom();
    cube.mesh = mesh;
    cube.line = line;
    cube.stopRotate = false;
    cube.stopTranslate = false;
    cube.changed = false;
    //cube.size = size;
    this.geometries.push(cube);
    this.scene.add(line);
  }

  private createSphere(size, translateX, translateY, translateZ, color) {
    let geometry = new SphereGeometry(size, 10, 10);
    let material = new MeshBasicMaterial({
      color: this.colors[color],
      side: DoubleSide,
      transparent: true,
      opacity: 0.5
    });
    let mesh = new Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;
    mesh.translateX(translateX);
    mesh.translateY(translateY);
    mesh.translateZ(translateZ);
    this.scene.add(mesh);
    var line = new LineSegments( geometry, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
    line.rotation.x = Math.PI / 2;
    line.translateX(translateX);
    line.translateY(translateY);
    line.translateZ(translateZ);
    let cube = new Geom();
    cube.mesh = mesh;
    cube.line = line;
    cube.stopRotate = false;
    cube.stopTranslate = false;
    cube.changed = false;
    //cube.size = size;
    this.geometries.push(cube);
    this.scene.add(line);
  }

  private createCilindre(radius1, radius2, height, translateX, translateY, translateZ, color) {
    let geometry = new CylinderGeometry(radius1, radius2, height, 10, 1);
    let material = new MeshBasicMaterial({
      color: this.colors[color],
      side: DoubleSide,
      transparent: true,
      opacity: 0.5
    });
    let mesh = new Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;
    mesh.translateX(translateX);
    mesh.translateY(translateY);
    mesh.translateZ(translateZ);
    this.scene.add(mesh);
    var line = new LineSegments( geometry, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
    line.rotation.x = Math.PI / 2;
    line.translateX(translateX);
    line.translateY(translateY);
    line.translateZ(translateZ);
    let cube = new Geom();
    cube.mesh = mesh;
    cube.line = line;
    cube.stopRotate = false;
    cube.stopTranslate = false;
    cube.changed = false;
    //cube.size = size;
    this.geometries.push(cube);
    this.scene.add(line);
  }

  private createTorus(radius, tube, translateX, translateY, translateZ, color) {
    let geometry = new TorusGeometry(radius, tube, 10, 10);
    let material = new MeshBasicMaterial({
      color: this.colors[color],
      side: DoubleSide,
      transparent: true,
      opacity: 0.5
    });
    let mesh = new Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;
    mesh.translateX(translateX);
    mesh.translateY(translateY);
    mesh.translateZ(translateZ);
    this.scene.add(mesh);
    var line = new LineSegments( geometry, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
    line.rotation.x = Math.PI / 2;
    line.translateX(translateX);
    line.translateY(translateY);
    line.translateZ(translateZ);
    let cube = new Geom();
    cube.mesh = mesh;
    cube.line = line;
    cube.stopRotate = false;
    cube.stopTranslate = false;
    cube.changed = false;
    //cube.size = size;
    this.geometries.push(cube);
    this.scene.add(line);
  }

  private colorsPalette() {
    this.colors = new Array();
    this.colors.push(new Color(0, 255, 255));
    this.colors.push(new Color(255, 0, 230));
    this.colors.push(new Color(205, 255, 0));
  }

  public render() {
    //console.log("render");

    this.moveCubes();

    //this.detectCollisions();

    this.projectLines();

    //this.moveCamera();

    this.renderer.render(this.scene, this.camera.camera);

    requestAnimationFrame(this.render);

  }

  renderControls() {
    this.renderer.render( this.scene, this.camera.camera );
  }

  public addControls() {
      this.controls = new THREE.OrbitControls(this.camera.camera);
      this.controls.rotateSpeed = 1.0;
      this.controls.zoomSpeed = 1.2;
      this.controls.addEventListener('change', this.renderControls);
  }

  private startRendering() {    
    this.renderer = new WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
    });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize( window.innerWidth - 2, window.innerHeight - 6 );

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.autoClear = true;

    this.render();
  }

  public onMouseMove(event: MouseEvent) {
    console.log("onMouse");
  }

  public onMouseDown(event: MouseEvent) {
    console.log("onMouseDown");
    event.preventDefault();

    // Example of mesh selection/pick:
    var raycaster = new Raycaster();
    var mouse = new Vector2();
    mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - (event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, this.camera.camera);

    var obj: THREE.Object3D[] = [];
    this.findAllObjects(obj, this.scene);
    var intersects = raycaster.intersectObjects(obj);
    console.log("Scene has " + obj.length + " objects");
    console.log(intersects.length + " intersected objects found")
    intersects.forEach((i) => {
        //console.log(i.object); // do what you want to do with object
        //i.object.position.y = i.object.position.y + 1;
        let cubesTmp: Geom[];
        cubesTmp = this.geometries.filter(cube => cube.mesh === i.object)
        if(cubesTmp.length > 0) {
          //console.log(cubesTmp[0].stopTranslate);
          if(!cubesTmp[0].changed) {
            cubesTmp[0].stopTranslate = !cubesTmp[0].stopTranslate;
            cubesTmp[0].stopRotate = !cubesTmp[0].stopRotate;
            cubesTmp[0].changed = true;
            console.log(cubesTmp[0].stopTranslate);
          }
        }
    });
    this.setAllChangedsToFalse();
    this.renderControls();
  }

  private setAllChangedsToFalse() {
    for(let cube of this.geometries) {
      cube.changed = false;
    }
  }

  private findAllObjects(pred: THREE.Object3D[], parent: THREE.Object3D) {
      // NOTE: Better to keep separate array of selected objects
      if (parent.children.length > 0) {
          parent.children.forEach((i) => {
              pred.push(i);
              this.findAllObjects(pred, i);                
          });
      }
  }
  
  public onMouseUp(event: MouseEvent) {
      console.log("onMouseUp");
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: Event) {

      console.log("onResize: " + (window.innerWidth - 2) + ", "  + (window.innerHeight - 6));

      this.camera.camera.aspect = this.getAspectRatio();
      this.camera.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth - 2, window.innerHeight - 6);
      this.render();
  }

  @HostListener('document:keypress', ['$event'])
  public onKeyPress(event: KeyboardEvent) {
      console.log("onKeyPress: " + event.key);
  }

  private getAspectRatio(): number {
    let height = this.canvas.clientHeight;
    if (height === 0) {
        return 0;
    }
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private detectCollisions() {
    for(let object of this.geometries) {
      let boxEval: Box3 = object.mesh.geometry.boundingBox;
      let position: Vector3 = object.mesh.position;
      let geom: Geometry;
      if(object.mesh.geometry instanceof BoxGeometry) {
        geom = <BoxGeometry>object.mesh.geometry;
      } else if(object.mesh.geometry instanceof SphereGeometry) {
        geom = <SphereGeometry>object.mesh.geometry;
      } else if(object.mesh.geometry instanceof CylinderGeometry) {
        geom = <CylinderGeometry>object.mesh.geometry;
      } else if(object.mesh.geometry instanceof TorusGeometry) {
        geom = <TorusGeometry>object.mesh.geometry;
      }
        //console.log(geom);
      //console.log(geom.vertices);
      for (var vertexIndex = 0; vertexIndex < geom.vertices.length; vertexIndex++) {  
        var matrix: Matrix3 = new Matrix3();
        var localVertex = geom.vertices[vertexIndex].clone();
        var globalVertex = localVertex.applyMatrix3(matrix);
        var directionVector = globalVertex.sub( position );
        var ray = new Raycaster( position, directionVector.clone().normalize() );
        this.scene.updateMatrixWorld(true);
        var collisionResults = ray.intersectObjects( this.scene.children, true );
        if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
        {
            // a collision occurred... do something...
            //console.log("colisio detectada");
            object.dfRotateX = (-1)*object.dfRotateX;
            object.dfRotateY = (-1)*object.dfRotateY;
            object.dfRotateZ = (-1)*object.dfRotateZ;
            object.dfTranslateX = (-1)*object.dfTranslateX;
            object.dfTranslateY = (-1)*object.dfTranslateY;
            object.dfTranslateZ = (-1)*object.dfTranslateZ;
        }
      }
    }
  }

  private loadLines() {
    for(let object1 of this.geometries) {
      let position1: Vector3 = object1.mesh.position;
      for(let object2 of this.geometries) {
        let position2: Vector3 = object2.mesh.position;
        var geometry = new THREE.Geometry();
        geometry.vertices.push(position1);
        geometry.vertices.push(position2);
        this.lines.push(new Line(geometry));
      }
    }
    for(let line of this.lines) {
      this.scene.add(line);
    }
  }

  private projectLines() {
    let material = new THREE.LineBasicMaterial( { color: 0xffffff } )
    for(let line of this.lines) {
      this.scene.remove(line);
    }
    this.lines = new Array();
    for(let object1 of this.geometries) {
      if(object1.stopRotate && object1.stopTranslate) {
        let position1: Vector3 = object1.mesh.position;
        for(let object2 of this.geometries) {
          if(object2 != object1) {
            if(object2.stopRotate && object2.stopTranslate) {
              let position2: Vector3 = object2.mesh.position;
              var geometry = new THREE.Geometry();
              geometry.vertices.push(position1);
              geometry.vertices.push(position2);
              this.lines.push(new Line(geometry, material));
            }
          }
        }
      }
      
    }
    for(let line of this.lines) {
      this.scene.add(line);
    }
  }

}
