// Based on CSS 4 https://www.w3.org/TR/css-color-4/#color-conversion-code

// Basic usage: for rgb to L*, then YtoLstar(toY(rgbArray)) // returns L*
// for rgb to greyscale, then YtoRGBgrey(toY(rgbArray))  // returns [r,g,b]


// standard white points, defined by 4-figure CIE x,y chromaticities
const D65 = [0.3127 / 0.3290, 1.00000, (1.0 - 0.3127 - 0.3290) / 0.3290];

// from CIE standard, which now defines these as rational fractions
const epsilon = 216/24389;  // 6^3/29^3
const kappa = 24389/27;   // 29^3/3^3

// As calculated in CSS 4
const sRGBco = [ 0.21263900587151027, 0.715168678767756, 0.07219231536073371 ];
const dP3co = [ 0.2289745640697488, 0.6917385218365064, 0.079286914093745 ];




// sRGB-related functions

export function sRGB2lin(chan) {
	// convert an RGB channel from TRC to linear
	// where in-gamut values are in the range [0 - 1]
	// to linear light (un-companded) form.
	// https://en.wikipedia.org/wiki/SRGB

	return (chan < 0.04045) ? chan / 12.92 : Math.pow((chan + 0.055) / 1.055, 2.4);
}

export function lin2sRGB(chan) {
	// convert a linear-light sRGB value in the range 0.0-1.0
	// to trc-applied form (IEC piecewise)

	return (chan > 0.0031308) ? 1.055 * Math.pow(chan, 1/2.4) - 0.055 : 12.92 * chan;
}


function linRGBtoY(A, B) {
  // Return Y from coefficients (B) and RGB (A) arrays
	return A[0] * B[0] + A[1] * B[1] + A[2] * B[2];
}


export function toY(rgb, colorspace = 'sRGB') {
	// convert an array of sRGB values to CIE Y
	// using sRGB's own white, D65 (no chromatic adaptation)
  // default is sRGB array [255,255,255]
  // else is displayP3 array [1,1,1]
  
 if (colorspace === 'sRGB') {
 for(let i=0;i<3;i++) {
    rgb[i] = sRGB2lin(rgb[i] / 255.0);
  }
	return linRGBtoY(rgb,sRGBco);
 } else {
  for(let i=0;i<3;i++) {
    rgb[i] = sRGB2lin(rgb[i]);
  }
	return linRGBtoY(rgb,dP3co);
 }
}



export function YtoRGBgrey(Y, colorspace = 'sRGB') {
  // Return simple array for either sRGB or P3 of achromatic grey.
  let greyRGB;
  if (colorspace === 'sRGB') {
    greyRGB = lin2sRGB(Y) * 255;
  } else {
    greyRGB = lin2sRGB(Y);
  }
  return [greyRGB,greyRGB,greyRGB];
}




// CIE Lstar to and from Y

export function YtoLstar(Y) {
	// Assuming Y is relative to D65 ref = 1, convert to CIE Lstar

	return Y > epsilon ? 116 * Math.cbrt(Y) - 16 : kappa * Y;  // L* in range [0,100]
}


export function LstarToY(Lstar) {
	// Convert Lstar to D65 Y reference 1.0
	// http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
  
	const thresh = kappa * epsilon;  // 6^3/29^3
  
	return Lstar > thresh ? Math.pow((Lstar+16)/116,3) : Lstar / kappa;
}


