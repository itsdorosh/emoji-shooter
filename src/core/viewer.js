class Viewer {

  _objContainer;
  _animationFrameId;
  _animationActions = [];
  _isAnimationPerforming = false;

  constructor(HTMLContainer) {
    this.HTMLContainer = HTMLContainer;
    this._objContainer = new THREE.Object3D();

    this.init();
  }

  init() {
    const {offsetWidth, offsetHeight} = this.HTMLContainer;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(70, offsetWidth / offsetHeight, 0.1, 1000);
    this.camera.position.set(0, 1, DEADLINE + 5);
    this.camera.lookAt(0, 2.5, 0);
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(offsetWidth, offsetHeight);
    this.renderer.setClearColor('#ffc0cb');
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

  drawObject(obj) {
    obj.position.set(
      getRandomInt(-RANGE_X, RANGE_X),
      getRandomFloat(0, RANGE_Y),
      -DEADLINE
    );

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