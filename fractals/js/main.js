var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

canvas.width  = window.innerWidth / 12 * 8;
canvas.height = window.innerHeight;

var width = canvas.width;
var height = canvas.height;

var img = ctx.createImageData(canvas.width, 1);

var maxIterations = 115;    
var zoom = [3.4, 3.4];
var interiorColor = [255, 255, 255, 255];
var lookAt = [0, 0];
var xRange = [0, 0];
var yRange = [0, 0];
var Cr;
var Ci;



function normalize_canvas() {
  var ratio = Math.abs(xRange[1]-xRange[0]) / Math.abs(yRange[1]-yRange[0]);
  var sratio = canvas.width/canvas.height;
  if ( sratio>ratio ) {
    var xf = sratio/ratio;
    xRange[0] *= xf;
    xRange[1] *= xf;
      zoom[0] *= xf;
  } else {
    var yf = ratio/sratio;
    yRange[0] *= yf;
    yRange[1] *= yf;
      zoom[1] *= yf;
  } 
}


function getColorPicker()
{
  document.getElementById("p_hide").style.zIndex = "-1";

  normalize_canvas();

  var p = document.getElementById("colorScheme").value;
  if ( p == "pickColorHSV1" ) return pickColorHSV1;
  if ( p == "pickColorHSV2" ) return pickColorHSV2;
  if ( p == "pickColorHSV3" ) return pickColorHSV3;
  if ( p == "pickColorGrayscale2" ) return pickColorGrayscale2;
  return pickColorGrayscale;
}


/*
 * Convert hue-saturation-value/luminosity to RGB.
 *
 * Input ranges:
 *   H =   [0, 360] (integer degrees)
 *   S = [0.0, 1.0] (float)
 *   V = [0.0, 1.0] (float)
 */
function hsv_to_rgb(h, s, v)
{
  if ( v > 1.0 ) v = 1.0;
  var hp = h/60.0;
  var c = v * s;
  var x = c*(1 - Math.abs((hp % 2) - 1));
  var rgb = [0,0,0];

  if ( 0<=hp && hp<1 ) rgb = [c, x, 0];
  if ( 1<=hp && hp<2 ) rgb = [x, c, 0];
  if ( 2<=hp && hp<3 ) rgb = [0, c, x];
  if ( 3<=hp && hp<4 ) rgb = [0, x, c];
  if ( 4<=hp && hp<5 ) rgb = [x, 0, c];
  if ( 5<=hp && hp<6 ) rgb = [c, 0, x];

  var m = v - c;
  rgb[0] += m;
  rgb[1] += m;
  rgb[2] += m;

  rgb[0] *= 255;
  rgb[1] *= 255;
  rgb[2] *= 255;
  return rgb;
}


function pickColorHSV1(steps, n, Tr, Ti)
{
  if ( n == steps ) // converged?
    return interiorColor;

  var v = n + 5;
  var c = hsv_to_rgb(360.0*v/steps, 1.0, 1.0);
  c.push(255); // alpha
  return c;
}

function pickColorHSV2(steps, n, Tr, Ti)
{
  if ( n == steps ) // converged?
    return interiorColor;

  var v = n + 5;
  var c = hsv_to_rgb(360.0*v/steps, 1.0, 10.0*v/steps);
  c.push(255); // alpha
  return c;
}

function pickColorHSV3(steps, n, Tr, Ti)
{
  if ( n == steps ) // converged?
    return interiorColor;

  var v = n + 5;
  var c = hsv_to_rgb(360.0*v/steps, 1.0, 10.0*v/steps);

  // swap red and blue
  var t = c[0];
  c[0] = c[2];
  c[2] = t;

  c.push(255); // alpha
  return c;
}

function pickColorGrayscale(steps, n, Tr, Ti)
{
  if ( n == steps ) // converged?
    return interiorColor;

  var v = n + 5;
  v = Math.floor(512.0*v/steps);
  if ( v > 255 ) v = 255;
  return [v, v, v, 255];
}

function pickColorGrayscale2(steps, n, Tr, Ti)
{
  if ( n == steps ) { // converged?
    var c = 255 - Math.floor(255.0*Math.sqrt(Tr+Ti)) % 255;
    if ( c < 0 ) c = 0;
    if ( c > 255 ) c = 255;
    return [c, c, c, 255];
  }

  return pickColorGrayscale(steps, n, Tr, Ti);
}