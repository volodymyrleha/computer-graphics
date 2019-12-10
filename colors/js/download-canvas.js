var canvas = document.getElementById("canvas");

download_img = function(el) {
  var image = canvas.toDataURL("image/jpg");
  el.href = image;
};