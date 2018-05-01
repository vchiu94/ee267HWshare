/**
 * @file Unwarp fragment shader
 *
 * @copyright The Board of Trustees of the Leland Stanford Junior University
 * @version 2018/03/28
 */

/* TODO Fragment shader implementation */

var shaderID = "fShaderUnwarp";

var shader = document.createTextNode( `
/**
 * WebGL doesn't set any default precision for fragment shaders.
 * Precision for vertex shader is set to "highp" as default.
 * Do not use "lowp". Some mobile browsers don't support it.
 */

precision mediump float;

varying vec2 textureCoords;

// texture rendered in the first rendering pass
uniform sampler2D map;

// center of lens for un-distortion
// in normalized coordinates between 0 and 1
uniform vec2 centerCoordinate;

// [width, height] size of viewport in [mm]
// viewport is the left/right half of the browser window
uniform vec2 viewportSize;

// lens distortion parameters [K_1, K_2]
uniform vec2 K;

// distance between lens and screen in [mm]
uniform float distLensScreen;


void main() {
	vec2 textCoordsMM = textureCoords*viewportSize;
	vec2 centerCoordsMM = centerCoordinate*viewportSize;
 	float rTilde = distance(textCoordsMM,centerCoordsMM);
	
	//float d = abs(1.0/((1.0/40.0)-(1.0/39.0)));
	float r = rTilde/distLensScreen;
	float distorter = 1.0+K[0]*pow(r,2.0)+K[1]*pow(r,4.0);
	vec2 distortedCoords = (2.0*textureCoords-vec2(1.0,1.0))*distorter;
	distortedCoords = (distortedCoords+vec2(1.0,1.0))/2.0;
	if(distortedCoords[0] >= 1.0 || distortedCoords[0] < 0.0 || distortedCoords[1] >= 1.0 || distortedCoords[1] < 0.0){
	gl_FragColor=vec4(0, 0, 0, 1);
	}
	else{
		gl_FragColor = texture2D( map, distortedCoords  );
	} 
	//gl_FragColor = texture2D( map, distortedCoords );

}
` );


var shaderNode = document.createElement( "script" );

shaderNode.id = shaderID;

shaderNode.setAttribute( "type", "x-shader/x-fragment" );

shaderNode.appendChild( shader );

document.body.appendChild( shaderNode );
