const dat = require('dat.gui');

var settings = {
  size: 150,
  angle: 0.4,
  scale: 0.67,
  iterations: 10,
  animate: true,
  speed: 0.3,
  offset: 0,
  slices: 13,
  arcAngle: 0.1,
  strokeSize: 1,
  strokeColor: {
    color: '#FFF',
    backgroundColor: '#000000'
  },
  mode: 'preset 1',
  lastModified: 'preset 1'
};

function changeSettingsConfig() {

  if(!settings.lastModified !== 'tunnel' && settings.mode === 'tunnel') {
    settings.scale = 1.2;
    settings.arcAngle = 0.3;
    settings.animate = true;
    settings.angle = 0;
    settings.iterations = 7;
    settings.speed = 0.01;
    settings.offset = 1;
    settings.slices = 30;
    settings.lastModified = 'tunnel';
  }
  
  if(!settings.lastModified !== 'tunnel2' && settings.mode === 'tunnel2') {
    settings.scale = 1.4;
    settings.arcAngle = 1.7;
    settings.animate = true;
    settings.angle = 3.14;
    settings.iterations = 5;
    settings.speed = 0.02;
    settings.offset = 0;
    settings.slices = 40;
    settings.lastModified = 'tunnel2';
  }
}
var width, height;
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

var bufferCanvas = document.createElement('canvas');
var bufferContext = bufferCanvas.getContext('2d');

window.addEventListener('resize', resize);
resize();

function resize() {
  width = bufferCanvas.width = canvas.width = window.innerWidth;
  height = bufferCanvas.height = canvas.height = window.innerHeight;
  
  bufferContext.translate(width * 0.5, height);
}

function draw() {
  requestAnimationFrame(draw);

  if (settings.animate) settings.angle += 0.02 * settings.speed;

  var points = [];

  bufferContext.save();
  bufferContext.setTransform(1, 0, 0, 1, 0, 0);
  bufferContext.clearRect(0, 0, width, height);
  bufferContext.restore();

  bufferContext.beginPath();
  bufferContext.moveTo(0, 0);
  bufferContext.lineTo(0, -settings.size * settings.scale);
  bufferContext.stroke();

  drawShape({x: 0, y: -settings.size * settings.scale, angle: -Math.PI * 0.5, size: settings.size});

  for (var i = 0; i < settings.iterations; i++) {
      for (var j = points.length - 1; j >= 0; j--) {
          drawShape(points.pop());
      }
  }

  function drawShape(point) {
      drawBranch(point, 1); 
      drawBranch(point, -1); 
  }

  function drawBranch(point, direction) {
      var angle = point.angle + (settings.angle * direction + settings.offset);
      var size = point.size * settings.scale;
      var x = point.x + Math.cos(angle) * size;
      var y = point.y + Math.sin(angle) * size;

      bufferContext.beginPath();
      bufferContext.moveTo(point.x, point.y);
      bufferContext.lineTo(x, y);
      bufferContext.stroke();

      points.unshift({x: x, y: y, angle: angle, size: size});
  }

  var side1 = width * 0.5;
  var side2 = height * 0.5;
  var radius = Math.sqrt(side1 * side1 + side2 * side2);

  bufferContext.globalCompositeOperation = 'destination-in';
  bufferContext.fillStyle = 'red';
  bufferContext.beginPath();

  if(settings.mode === 'preset 1') {
    bufferContext.arc(0, 0, radius, -(Math.PI * settings.arcAngle + (Math.PI / settings.slices)), -(Math.PI * 0.5 - (Math.PI / settings.slices)));
  } else if(settings.mode === 'tunnel' || settings.mode === 'tunnel2') {
    bufferContext.rect(0, 0, radius, -(Math.PI * settings.arcAngle + (Math.PI / settings.slices)), -(Math.PI * 0.5 - (Math.PI / settings.slices)));
  }
  bufferContext.lineTo(0, 0);
  bufferContext.closePath();
  bufferContext.fill();
  bufferContext.globalCompositeOperation = 'source-over';

  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, width, height);
  context.translate(width * 0.5, height * 0.5);
  
  for (var i = 0; i < settings.slices; i++) {
      context.rotate(Math.PI * 2 / settings.slices);
      context.drawImage(bufferCanvas, -width * 0.5, -height);
  }

  bufferContext.strokeStyle = settings.strokeColor.color;
  document.querySelector('body').style.backgroundColor = settings.strokeColor.backgroundColor;
}

draw();

var gui = new dat.GUI();
gui.add(settings, 'animate');
gui.add(settings, 'mode', ['preset 1', 'tunnel', 'tunnel2']).listen().onFinishChange((e) => {
  changeSettingsConfig();
});
gui.add(settings, 'scale', 0, 4).step(0.1).listen();
gui.add(settings, 'arcAngle', 0, 2).step(0.1).listen();
gui.add(settings, 'angle', 0, Math.PI);
gui.add(settings, 'iterations', 0, 12).step(1).listen();
gui.add(settings, 'speed', 0, 2).listen();
gui.add(settings, 'offset', 0, Math.PI * 2).listen();
gui.add(settings, 'slices', 1, 40).step(1).listen();
gui.addColor(settings.strokeColor, 'color').listen();
gui.addColor(settings.strokeColor, 'backgroundColor').listen();
