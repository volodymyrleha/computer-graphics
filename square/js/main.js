function draw() {
  if (check_if_posiible()) {
    document.getElementById("p_hide").style.display = "none";

    var canvas = document.querySelector('canvas');
    var ctx = canvas.getContext('2d');

    canvas.width  = window.innerWidth / 12 * 8;
    canvas.height = window.innerHeight;

    var width = canvas.width;
    var height = canvas.height;

    var x0 = canvas.width/2;
    var y0 = canvas.height/2;
    var step = 50;

    draw_graph(ctx, x0, y0, step);


    var square_matrix = [];

    get_square(square_matrix, step, x0, y0);

    $('#affine_order option').each(function() {
      if ($(this).is(':selected')) {
        var order = $(this).val();

        for (var i = 0; i < order.length; i++) {
          if (order[i] == 'o') {
            transfrom(square_matrix, step);

          } else if (order[i] == 's') {
            scale(square_matrix, step);

          } else if (order[i] == 'r') {
            rotate(square_matrix, step);
          }
        }
      } 
    });

    draw_square(square_matrix, ctx, x0, y0);
  }
}

function draw_graph(ctx, x0, y0, step) {
  ctx.moveTo(canvas.width/2, 0);
  ctx.lineTo(canvas.width/2, canvas.height);
  ctx.stroke();

  ctx.moveTo(0, canvas.height/2);
  ctx.lineTo(canvas.width, canvas.height/2);
  ctx.stroke();

  ctx.font = "18px Arial";
  ctx.fillText("0", x0 - 30, y0 + 30);

  ctx.moveTo(x0 + step, y0 - 10);
  ctx.lineTo(x0 + step, y0 + 10);
  ctx.stroke();
  ctx.fillText("1", x0 + 45, y0 + 30);

  ctx.moveTo(x0 - 10, y0 - step);
  ctx.lineTo(x0 + 10, y0 - step);
  ctx.stroke();
  ctx.fillText("1", x0 - 30, y0 - 45);
}

function get_square(matrix, step, x0, y0) {
  var x = $('#dx0').val() * step;
  var y = - $('#dy0').val() * step;

  for (var i = 0 + x; i < ($('#dx1').val() * step); i++) {
    for (var j = 0 - y; j < ($('#dy1').val() * step); j++) {
      matrix.push([i, -j, 1]);
    }
  }
}

function draw_square(matrix, ctx, x0, y0) {
  for (var i = 0; i < matrix.length; i++) {
    ctx.beginPath();
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "#AC2424";
    ctx.fillRect(matrix[i][0] + x0, matrix[i][1] + y0, 1, 1);
    ctx.stroke();
  }
}

function multiply_matrixs(a, b, a_one) {
  var aNumRows = a.length, aNumCols = a[0].length,
      bNumRows = b.length, bNumCols = b[0].length,
      m = new Array(aNumRows);

  if (a_one) {
    aNumRows = 1;
    aNumCols = a.length;
  }

  if (a_one) {
     for (var c = 0; c < bNumCols; ++c) {
      m[c] = 0;        
           
        for (var i = 0; i < aNumCols; ++i) {
          m[c] += a[i] * b[i][c];
        }
      }
  } else {

  for (var r = 0; r < aNumRows; ++r) {
    m[r] = new Array(bNumCols); // initialize the current row
    for (var c = 0; c < bNumCols; ++c) {
      m[r][c] = 0;        
           
      for (var i = 0; i < aNumCols; ++i) {
        m[r][c] += a[r][i] * b[i][c];
      }
    }
  }
  }


  return m;
}

function transfrom(matrix, step) {
  var m = $("#offset_x").val() * step;
  var n = - $("#offset_y").val() * step;

  var transfrom_matrix = [[1, 0, 0],
                          [0, 1, 0],
                          [m, n, 1]];

  for (var i = 0; i < matrix.length; i++) {
    matrix[i] = multiply_matrixs(matrix[i], transfrom_matrix, true);
  }
}

function scale(matrix, step) {
  var a = $("#scale_a").val();
  var d = $("#scale_d").val();

  var scale_matrix = [[a, 0, 0],
                      [0, d, 0],
                      [0, 0, 1]];

  for (var i = 0; i < matrix.length; i++) {
    matrix[i] = multiply_matrixs(matrix[i], scale_matrix, true);
  }
}

function rotate(matrix, step) {
  var val = - $("#rotate_val").val() * Math.PI / 180;

  var scale_matrix = [[Math.cos(val), Math.sin(val), 0],
                      [-Math.sin(val), Math.cos(val), 0],
                      [0, 0, 1]];

  for (var i = 0; i < matrix.length; i++) {
    matrix[i] = multiply_matrixs(matrix[i], scale_matrix, true);
  } 
}

function check_if_posiible() {
  if ($("#dx0").val() >= $("#dx1").val()) {
    alert("x1 needs to be bigger than x0");
    return false;

  } else if ($("#dy0").val() >= $("#dy1").val()) {
    alert("y1 needs to be bigger than y0");
    return false;

  } else if ($("#dy1").val() - $("#dy0").val() 
             != $("#dx1").val() - $("#dx0").val()) {
    alert("It's not a square");

  } else {
    return true;
  }
}
