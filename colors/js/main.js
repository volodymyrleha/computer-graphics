// rgb -> hsv
function rgb_to_hsv(r, g, b) {
	var r2 = r / 255;
	var g2 = g / 255;
	var b2 = b / 255;

	var cmax = Math.max(r2, g2, b2);
	var cmin = Math.min(r2, g2, b2);

	var diff = cmax - cmin;

	var h;

	if (diff == 0) {
		h = 0;

	} else {
		if (cmax == r2) {
			h = (60 * ((g2 - b2) / diff) + 360) % 360;

		} else if (cmax == g2) {
			h = (60 * ((b2 - r2) / diff) + 120) % 360;

		} else if (cmax == b2) {
			h = (60 * ((r2 - g2) / diff) + 240) % 360;
		}
	}


	var s;

	if (cmax == 0) {
		s = 0;
	} else {
		s = diff / cmax * 100;
	}

	var v = cmax * 100;

	h = Math.round(h);
	s = Number(s.toFixed(1));
	v = Number(v.toFixed(1));

	return [h, s, v];
}


// hsv -> cmyk 
function hsv_to_cmyk(h, s, v) {
	var r, g, b;
    var i;
    var f, p, q, t;
     
    s /= 100;
    v /= 100;
     
    if (s == 0) {
        r = g = b = v;
    }
     
    h /= 60;
    i = Math.floor(h);
    f = h - i; 
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));
     
    switch(i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
     
        case 1:
            r = q;
            g = v;
            b = p;
            break;
     
        case 2:
            r = p;
            g = v;
            b = t;
            break;
     
        case 3:
            r = p;
            g = q;
            b = v;
            break;
     
        case 4:
            r = t;
            g = p;
            b = v;
            break;
     
        default: // case 5:
            r = v;
            g = p;
            b = q;
    }

   
   	var k = 1 - Math.max(r, g, b);
   	var c = Math.round((1 - r - k) / (1 - k) * 100);
   	var m = Math.round((1 - g - k) / (1 - k) * 100);
   	var y = Math.round((1 - b - k) / (1 - k) * 100);
   	k = Math.round(k * 100);

   	return [c, m, y, k];
}

// cmyk -> hsv
function cmyk_to_rgb(c, m, y, k) {
	var r = Math.round(255 * (1 - c / 100) * (1 - k / 100));
	var g = Math.round(255 * (1 - m / 100) * (1 - k / 100));
	var b = Math.round(255 * (1 - y / 100) * (1 - k / 100));

	return [r, g, b];
}

// hsv -> rbg
function hsv_to_rgb(h, s, v) {
	var r, g, b;
    var i;
    var f, p, q, t;
     
    s /= 100;
    v /= 100;
     
    if (s == 0) {
        r = g = b = v;
    }
     
    h /= 60;
    i = Math.floor(h);
    f = h - i; 
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));
     
    switch(i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
     
        case 1:
            r = q;
            g = v;
            b = p;
            break;
     
        case 2:
            r = p;
            g = v;
            b = t;
            break;
     
        case 3:
            r = p;
            g = q;
            b = v;
            break;
     
        case 4:
            r = t;
            g = p;
            b = v;
            break;
     
        default: // case 5:
            r = v;
            g = p;
            b = q;
    }

   	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}