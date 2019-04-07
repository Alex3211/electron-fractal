
module.exports = class DrawManager {
  constructor(settings, width, height, canvas, context, bufferCanvas, bufferContext) {
    this.settings = settings;
    this.width = width;
    this.height = height;
    this.canvas = canvas;
    this.context = context;
    this.bufferCanvas = bufferCanvas;
    this.bufferContext = bufferContext;
    this.points = [];
  }
  drawBranch(point, direction) {
    var angle = point.angle + (this.settings.angle * direction + this.settings.offset);
    var size = point.size * this.settings.scale;
    var x = point.x + Math.cos(angle) * size;
    var y = point.y + Math.sin(angle) * size;
    // this.bufferContext.lineWidth = 3; // WORKS
    this.bufferContext.setLineDash([1, 5]);
    // this.bufferContext.globalAlpha = 0.5;
    this.bufferContext.lineCap = 'round';
    this.bufferContext.shadowColor = 'blue';
    this.bufferContext.shadowBlur = 15;
    this.bufferContext.beginPath();
    this.bufferContext.moveTo(point.x, point.y);
    this.bufferContext.lineTo(x, y);
    this.bufferContext.stroke();
    this.points.unshift({
      x: x,
      y: y,
      angle: angle,
      size: size
    });
  }
  drawShape(point) {
    this.drawBranch(point, 1);
    this.drawBranch(point, -1);
  }
  draw() {
    requestAnimationFrame(() => this.draw());
    this.drawMethodSecond();
  }
  drawMethodBase() {
    if (this.settings.animate) this.settings.angle += 0.02 * this.settings.speed;
    this.points = [];
    this.bufferContext.save();
    this.bufferContext.setTransform(1, 0, 0, 1, 0, 0);
    this.bufferContext.clearRect(0, 0, this.width, this.height);
    this.bufferContext.restore();
    this.bufferContext.beginPath();
    this.bufferContext.moveTo(0, 0);
    this.bufferContext.lineTo(0, -this.settings.size * this.settings.scale);
    this.bufferContext.stroke();
    this.drawShape({
      x: 0,
      y: -this.settings.size * this.settings.scale,
      angle: -Math.PI * 0.5,
      size: this.settings.size
    });
    for (var i = 0; i < this.settings.iterations; i++) {
      for (var j = this.points.length - 1; j >= 0; j--) {
        this.drawShape(this.points.pop());
      }
    }
    var side1 = this.width * 0.5;
    var side2 = this.height * 0.5;
    var radius = Math.sqrt(side1 * side1 + side2 * side2);
    this.bufferContext.globalCompositeOperation = 'destination-in';
    this.bufferContext.fillStyle = 'red';
    this.bufferContext.beginPath();
    if (this.settings.mode === 'preset 1') {
      this.bufferContext.arc(0, 0, radius, -(Math.PI * this.settings.arcAngle + (Math.PI / this.settings.slices)), -(Math.PI * 0.5 - (Math.PI / this.settings.slices)));
    } else if (this.settings.mode === 'tunnel' || this.settings.mode === 'tunnel2') {
      this.bufferContext.rect(0, 0, radius, -(Math.PI * this.settings.arcAngle + (Math.PI / this.settings.slices)), -(Math.PI * 0.5 - (Math.PI / this.settings.slices)));
    }
    this.bufferContext.lineTo(0, 0);
    this.bufferContext.closePath();
    this.bufferContext.fill();
    this.bufferContext.globalCompositeOperation = 'source-over';
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.translate(this.width * 0.5, this.height * 0.5);
    for (var i = 0; i < this.settings.slices; i++) {
      this.context.rotate(Math.PI * 2 / this.settings.slices);
      this.context.drawImage(this.bufferCanvas, -this.width * 0.5, -this.height);
    }
    this.bufferContext.strokeStyle = this.settings.strokeColor.color;
    document.querySelector('body').style.backgroundColor = this.settings.strokeColor.backgroundColor;
  }
  drawMethodSecond() {
    if (this.settings.animate) this.settings.angle += 0.02 * this.settings.speed;
    this.points = [];
    this.bufferContext.save();
    this.bufferContext.setTransform(1, 0, 0, 1, 0, 0);
    this.bufferContext.clearRect(0, 0, this.width, this.height);
    this.bufferContext.globalCompositeOperation = 'source-over';
    this.bufferContext.restore();
    this.drawShape({
      x: 0,
      y: -this.settings.size * this.settings.scale,
      angle: -Math.PI * 1,
      size: this.settings.size
    });
    for (var i = 0; i < this.settings.iterations; i++) {
      for (var j = this.points.length - 1; j >= 0; j--) {
        this.drawShape(this.points.pop());
      }
    }

    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.translate(this.width * 0.5, this.height * 0.5);
    for (var i = 0; i < this.settings.slices; i++) {
      this.context.rotate(Math.PI * 2 / this.settings.slices);
      this.context.drawImage(this.bufferCanvas, -this.width * 0.5, -this.height);
    }

    this.bufferContext.strokeStyle = this.settings.strokeColor.color;
    document.querySelector('body').style.backgroundColor = this.settings.strokeColor.backgroundColor;
  }
}