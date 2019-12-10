function iterateMandelbrot(Cr, Ci, iterations)
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

function iterateJulia(Cr, Ci, iterations) {
  var z = math.complex(Cr, Ci);

  var n = 0;  

  for (;; ++n) {
    if (math.abs(z) > 2 || n == iterations) {
      break;
    } else {
      z = z.mul(z);
        z = z.add(math.complex(document.getElementById("c_for_x").value, document.getElementById("c_for_y").value));
    }
  }

  return [n, Cr, Ci];
}

function draw()
{
  var pickColor = getColorPicker();
  lookAt = [- document.getElementById('c_for_x').value, - document.getElementById('c_for_y').value];
  zoom = [document.getElementById('zoom_val').value, document.getElementById('zoom_val').value];

  xRange = [lookAt[0]-zoom[0]/2, lookAt[0]+zoom[0]/2];
  yRange = [lookAt[1]-zoom[1]/2, lookAt[1]+zoom[1]/2];

  normalize_canvas();

  var Cr_step = zoom[0] / canvas.width;
  var Ci_step = zoom[1] / canvas.height;

  var Ci = yRange[0];

  for (var y = 0; y < height; y++) {
    Cr = xRange[0];
    for (var x = 0; x < width; x++) {

      var p;
      
        if ($("#fractalType").val() == "julia") {
          p = iterateJulia(Cr, Ci, maxIterations);
        } else {
          p = iterateMandelbrot(Cr, Ci, maxIterations);
        }

    var color = pickColor(maxIterations, p[0], p[1], p[2]);

      img.data[x * 4 + 0] = color[0];
      img.data[x * 4 + 1] = color[1];
      img.data[x * 4 + 2] = color[2];
      img.data[x * 4 + 3] = 255;

      Cr += Cr_step;
    }
    Ci += Ci_step;
    ctx.putImageData(img, 0, y);
  }
}
