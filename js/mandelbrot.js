function $(id) {return document.getElementById(id);}

/*
 * Global variables:
 */
var zoom = [3.4, 3.4];
var lookAt = [0, 0];
var xRange = [0, 0];
var yRange = [0, 0];
var interiorColor = [0, 0, 0, 255];
var dragToZoom = true;
var colors = [[0,0,0,0]];

/*
 * Initialize canvas
 */
var canvas = $('canvasMandelbrot');
canvas.width  = window.innerWidth / 12 * 8;
canvas.height = window.innerHeight;

//
var ctx = canvas.getContext('2d');
var img = ctx.createImageData(canvas.width, 1);

function normalize_canvas() {
  xRange = [lookAt[0]-zoom[0]/2, lookAt[0]+zoom[0]/2];
  yRange = [lookAt[1]-zoom[1]/2, lookAt[1]+zoom[1]/2];

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

/*
 * Main renderer equation.
 *
 * Returns number of iterations and values of Z_{n}^2 = Tr + Ti at the time
 * we either converged (n == iterations) or diverged.  We use these to
 * determined the color at the current pixel.
 *
 * The Mandelbrot set is rendered taking
 *
 *     Z_{n+1} = Z_{n}^2 + C
 *
 * with C = x + iy, based on the "look at" coordinates.
 *
 * The Julia set can be rendered by taking
 *
 *     Z_{0} = C = x + iy
 *     Z_{n+1} = Z_{n} + K
 *
 * for some arbitrary constant K.  The point C for Z_{0} must be the
 * current pixel we're rendering, but K could be based on the "look at"
 * coordinate, or by letting the user select a point on the screen.
 */
function iterateEquation(Cr, Ci, iterations)
{
  var Zr = 0;
  var Zi = 0;
  var Tr = 0;
  var Ti = 0;
  var n  = 0;

  for ( ; n<iterations && (Tr+Ti)<= 4; ++n ) {
    Zi = 2 * Zr * Zi + Ci;
    Zr = Tr - Ti + Cr;
    Tr = Zr * Zr;
    Ti = Zi * Zi;
  }

  return [n, Tr, Ti];
}

function draw(pickColor)
{
  lookAt = [$('c_for_x').value, $('c_for_y').value];
  zoom = [$('zoom_val').value, $('zoom_val').value];

  xRange = [lookAt[0]-zoom[0]/2, lookAt[0]+zoom[0]/2];
  yRange = [lookAt[1]-zoom[1]/2, lookAt[1]+zoom[1]/2];

  normalize_canvas();

  var steps = 100;

  var Cr_step = zoom[0] / canvas.width;
  var Ci_step = zoom[1] / canvas.height;


  function drawLine(Ci, off, Cr, Cr_step)
  {
    for ( var x=0; x<canvas.width; ++x, Cr += Cr_step ) {
      var p = iterateEquation(Cr, Ci, steps);
      var color = pickColor(steps, p[0], p[1], p[2]);
      img.data[off++] = color[0];
      img.data[off++] = color[1];
      img.data[off++] = color[2];
      img.data[off++] = 255;
    }
  }

  function render()
  {
    var Ci = yRange[0];
    var sy = 0;

    var scanline = function()
    {      
      if (sy++ < canvas.height) {
        drawLine(Ci, 0, xRange[0], Cr_step);
        Ci += Ci_step;
        ctx.putImageData(img, 0, sy);
        scanline();
      }
    };

    scanline();
  }
  render();
}









function getColorPicker()
{
  document.getElementById("p_hide").style.zIndex = "-1";

  var p = $("colorScheme").value;
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



// Some constants used with smoothColor
var logBase = 1.0 / Math.log(2.0);
var logHalfBase = Math.log(0.5)*logBase;

function smoothColor(steps, n, Tr, Ti)
{
  /*
   * Original smoothing equation is
   *
   * var v = 1 + n - Math.log(Math.log(Math.sqrt(Zr*Zr+Zi*Zi)))/Math.log(2.0);
   *
   * but can be simplified using some elementary logarithm rules to
   */
  return 5 + n - logHalfBase - Math.log(Math.log(Tr+Ti))*logBase;
}

function pickColorHSV1(steps, n, Tr, Ti)
{
  if ( n == steps ) // converged?
    return interiorColor;

  var v = smoothColor(steps, n, Tr, Ti);
  var c = hsv_to_rgb(360.0*v/steps, 1.0, 1.0);
  c.push(255); // alpha
  return c;
}

function pickColorHSV2(steps, n, Tr, Ti)
{
  if ( n == steps ) // converged?
    return interiorColor;

  var v = smoothColor(steps, n, Tr, Ti);
  var c = hsv_to_rgb(360.0*v/steps, 1.0, 10.0*v/steps);
  c.push(255); // alpha
  return c;
}

function pickColorHSV3(steps, n, Tr, Ti)
{
  if ( n == steps ) // converged?
    return interiorColor;

  var v = smoothColor(steps, n, Tr, Ti);
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

  var v = smoothColor(steps, n, Tr, Ti);
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

