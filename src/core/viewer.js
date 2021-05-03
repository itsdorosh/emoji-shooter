export class Viewer {

  _objContainer;
  _animationFrameId;
  _animationActions = [];
  _isAnimationPerforming = false;

  constructor(HTMLContainer) {
    this.HTMLContainer = HTMLContainer;
    this._objContainer = new THREE.Object3D();
  }

  init(initialisationParams = {backgroundColor: "", cameraPosition: {x: 1, y: 1, z: 1}, cameraLookAt: {x: 0, y: 0, z: 0}}) {
    const {offsetWidth, offsetHeight} = this.HTMLContainer;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(70, offsetWidth / offsetHeight, 0.1, 1000);

    // noinspection JSCheckFunctionSignatures
    this.camera.position.set(
      initialisationParams.cameraPosition.x,
      initialisationParams.cameraPosition.y,
      initialisationParams.cameraPosition.z,
    );

    this.camera.lookAt(
      initialisationParams.cameraLookAt.x,
      initialisationParams.cameraLookAt.y,
      initialisationParams.cameraLookAt.z,
    );

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(offsetWidth, offsetHeight);
    this.renderer.setClearColor(initialisationParams.backgroundColor);
    this.HTMLContainer.appendChild(this.renderer.domElement);
    this.scene.add(this._objContainer);
    const grid = new THREE.GridHelper(100, 20, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    this.scene.add(grid);
    this.renderFrame();
    window.addEventListener('resize', this.onWindowResize);
  }

  addAnimationActions(...callbacks) {
    this._animationActions.push(...callbacks);
  }

  clearAnimationActions() {
    this._animationActions.length = 0;
  }

  performAnimation() {
    this._animationFrameId = requestAnimationFrame(() => {
      if (this._animationActions.length) {
        this._animationActions.forEach(animationAction => animationAction(this._objContainer.children));
      }

      this.renderFrame();
      this._isAnimationPerforming && this.performAnimation();
    });
  }

  startAnimation() {
    this._isAnimationPerforming = true;
    this.performAnimation();
  }

  stopAnimation() {
    this._isAnimationPerforming = false;
    cancelAnimationFrame(this._animationFrameId);
  }

  onWindowResize = () => {
    this.camera.aspect = this.HTMLContainer.offsetWidth / this.HTMLContainer.offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.HTMLContainer.offsetWidth, this.HTMLContainer.offsetHeight);
    this.renderFrame();
  }

  renderFrame() {
    this.renderer.render(this.scene, this.camera);
  }

  get objContainer() {
    return this._objContainer;
  }

  drawObject(creationParams = {type: '', position: {x: 0, y: 0, z: 0}, scale: {x: 1, y: 1, z: 1}, data: null}) {
    let obj;

    switch (creationParams.type) {
      case "SPRITE": {
        const spriteTexture = new THREE.Texture(creationParams.data);
        spriteTexture.needsUpdate = true;

        const spriteMaterial = new THREE.SpriteMaterial({
          map: spriteTexture,
          transparent: false,
          alphaTest: 0.5
        });

        obj = new THREE.Sprite(spriteMaterial);
        break;
      }

      default: {
        throw new Error("Not implemented");
      }
    }

    obj.position.set(creationParams.position.x, creationParams.position.y, creationParams.position.z);
    obj.scale.set(creationParams.scale.x, creationParams.scale.y, creationParams.scale.z);

    this._objContainer.add(obj);
    return obj.uuid;
  }

  removeObject(uuid) {
    const objForRemove = this._objContainer.getObjectByProperty('uuid', uuid);
    this._objContainer.remove(objForRemove);
  }

  removeAllObjects() {
    while (this._objContainer.children.length > 0) {
      this._objContainer.remove(this._objContainer.children[0]);
    }
  }
}
