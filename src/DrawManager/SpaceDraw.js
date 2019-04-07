module.exports = class SpaceDraw {
  constructor(settings, width, height, canvas, context, bufferCanvas, bufferContext) {
    this.settings = settings;
    this.canvas = canvas;
    this.context = context;
    this.screenWidth = width;
    this.screenHeight = height;
    this.doublePI = Math.PI * 2;
    this.step = 0;
    this.points = [];
    this.focalLength = 500;
  }

  draw() {
    this.generatePoints();
    this.loop();
  }

  generatePoints() {
    var i = 1000;

    for (i; i > -1; --i) {
      var point3D = {
        x: (1 - Math.random() * 2) * 600,
        y: (1 - Math.random() * 2) * 600,
        z: (1 - Math.random() * 2) * 600,
        vx: 0,
        vy: 0,
        vz: 0
      };

      this.points.push(point3D);
    }
  }

  loop() {
    this.context.globalAlpha = 0.4;
    this.context.fillStyle = this.settings.bgSpaceGradient;
    this.context.fillRect(0, 0, this.screenWidth, this.screenHeight);
    this.context.globalAlpha = 1;

    this.updatePoints();
    this.renderPoints();
    this.renderWire();

    this.step += 0.02;

    getAnimationFrame(() => this.loop());
  }

  renderPoints() {
    var i = this.points.length - 1;

    for (i; i > -1; --i) {
      var point = this.points[i];
      var scale = this.focalLength / (point.z + this.focalLength);

      var px = (point.x * scale + (this.screenWidth >> 1));
      var py = point.y * scale + (this.screenHeight >> 1);

      this.drawPoint({
        x: px,
        y: py
      }, scale);
    }
  }

  renderWire() {
    this.context.globalAlpha = 0.02;
    this.context.lineWidth = 1;
    this.context.strokeStyle = '#FFF';
    this.context.beginPath();

    var i = this.points.length - 1;

    for (i; i > -1; --i) {
      var point = this.points[i];
      var scale = this.focalLength / (point.z + this.focalLength);

      if (i === this.points.length - 1) this.context.moveTo(point.x * scale + (this.screenWidth >> 1), point.y * scale + (this.screenHeight >> 1));
      else this.context.lineTo(point.x * scale + (this.screenWidth >> 1), point.y * scale + (this.screenHeight >> 1));
    }

    if (Math.random() > 0.4) this.context.stroke();
    this.context.closePath();
    this.context.globalAlpha = 1;
  }

  updatePoints() {
    var i = this.points.length - 1;

    for (i; i > -1; --i) {
      var point = this.points[i];
      point.x += Math.cos(this.step * 0.4) * 2;
      point.y += Math.sin(this.step * 0.8) * 2;
      point.z -= 2;

      this.checkBounds(point);
    }
  }

  checkBounds(point) {
    if (point.x < -2000) point.x = Math.random() * 2000;
    else if (point.x > 2000) point.x = Math.random() * -2000;

    if (point.y < -2000) point.y = Math.random() * 2000;
    else if (point.y > 2000) point.y = Math.random() * -2000;

    if (point.z < -500) point.z = Math.random() * 2400 + 200;
  }

  drawPoint(point, scale) {
    this.context.globalAlpha = scale;
    this.context.fillStyle = '#FAA';
    this.context.beginPath();
    this.context.rect(point.x, point.y, (1.6 * scale > 0) ? 1.6 * scale : 1, (1.6 * scale > 0) ? 1.6 * scale : 1);
    this.context.fill();
    this.context.closePath();
    this.context.globalAlpha = 1;
  }
}