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
  strokeColor: {
    color: '#d90f0f',
    backgroundColor: '#000000'
  },
  mode: false
};

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

  if(settings.mode) {
    bufferContext.arc(0, 0, radius, -(Math.PI * 0.8 + (Math.PI / settings.slices)), -(Math.PI * 0.5 - (Math.PI / settings.slices)));
  } else {
    bufferContext.arc(0, 0, radius, -(Math.PI * 0.5 + (Math.PI / settings.slices)), -(Math.PI * 0.5 - (Math.PI / settings.slices)));
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
  console.log(document.querySelector('body'))
  console.log(document.querySelector('body').style)
  console.log(document.querySelector('body').style.backgroundColor)
  document.querySelector('body').style.backgroundColor = settings.strokeColor.backgroundColor;
}

draw();

var gui = new dat.GUI();
gui.add(settings, 'animate');
gui.add(settings, 'mode');
gui.add(settings, 'scale', 0, 4).step(0.1);
gui.add(settings, 'angle', 0, Math.PI);
gui.add(settings, 'iterations', 0, 12).step(1);
gui.add(settings, 'speed', 0, 2);
gui.add(settings, 'offset', 0, Math.PI * 2);
gui.add(settings, 'slices', 1, 40).step(1);
gui.addColor(settings.strokeColor, 'color');
gui.addColor(settings.strokeColor, 'backgroundColor');