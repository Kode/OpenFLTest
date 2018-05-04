const fs = require('fs');
const path = require('path');

function createApplicationMain() {
	let am = fs.readFileSync('Libraries/openfl/assets/templates/haxe/ApplicationMain.hx', 'utf8');
	am = am.replace(/::WIN_FPS::/g, '60');
	am = am.replace(/::allowHighDPI::/g, 'true');
	am = am.replace(/::alwaysOnTop::/g, 'false');
	am = am.replace(/::antialiasing::/g, '0');
	am = am.replace(/::background::/g, 'null');
	am = am.replace(/::borderless::/g, 'false');
	am = am.replace(/::colorDepth::/g, '32');
	am = am.replace(/::depthBuffer::/g, 'true');
	am = am.replace(/::display::/g, '0');
	am = am.replace(/::fullscreen::/g, 'false');
	am = am.replace(/::hardware::/g, 'true');
	am = am.replace(/::height::/g, '600');
	am = am.replace(/::hidden::/g, 'false');
	am = am.replace(/::maximized::/g, 'false');
	am = am.replace(/::minimized::/g, 'false');
	am = am.replace(/::parameters::/g, '[]');
	am = am.replace(/::resizable::/g, 'false');
	am = am.replace(/::stencilBuffer::/g, 'true');
	am = am.replace(/::title::/g, 'OpenFL Test');
	am = am.replace(/::vsync::/g, 'true');
	am = am.replace(/::width::/g, '800');
	am = am.replace(/::x::/g, '100');
	am = am.replace(/::y::/g, '100');
	am = am.replace(/::APP_MAIN::/g, 'Main');
	am = am.replace(/::foreach windows::/g, '');
	am = am.replace(/::end::/g, '');
	am = am.replace(/::if\ \(PRELOADER_NAME\ !=\ \"\"\)::/g, '/*');
	am = am.replace(/::else::/g, '*/');

	if (!fs.existsSync('build')) {
		fs.mkdirSync('build');
	}
	if (!fs.existsSync('build/Sources')) {
		fs.mkdirSync('build/Sources');
	}
	fs.writeFileSync('build/Sources/ApplicationMain.hx', am, 'utf8');
}

function createManifestResources() {
	let mr = fs.readFileSync('Libraries/lime/templates/haxe/ManifestResources.hx', 'utf8');
	mr = mr.replace(/::if \(assets != null\)::/g, '/*');
	mr = mr.replace(/::foreach/g, '/*');
	mr = mr.replace(/::end::::end::::end::::end::/g, '*/');
	mr = mr.replace(/::end::::end::::end::/g, '*/');
	mr = mr.replace(/::end::::end::/g, '*/');
	mr = mr.replace(/::library::/g, 'default');

	mr = mr.replace(/::manifest::/g,
  'manifest = new lime.utils.AssetManifest();\n'
+ 'manifest.assets = [\n'
+ '{\n'
+ 'id: "assets/wabbit_alpha.png",\n'
+ 'path: "assets/wabbit_alpha.png",\n'
+ 'preload: true,\n'
+ 'size: 449,\n'
+ 'type: "IMAGE"\n'
+ '}\n'
+ '];\n'
+ 'manifest.libraryArgs = [];\n'
+ 'manifest.libraryType = null;\n'
+ 'manifest.name = null;\n'
+ 'manifest.rootPath = "";\n'
+ 'manifest.version = 2;\n');

	mr = mr.replace(/::images::/g,
  '#if !macro\n'
+ '@:image("../Assets/wabbit_alpha.png") #if display private #end class __ASSET__assets_wabbit_alpha_png extends lime.graphics.Image {}\n'
+ '#end');

	if (!fs.existsSync('build')) {
		fs.mkdirSync('build');
	}
	if (!fs.existsSync('build/Sources')) {
		fs.mkdirSync('build/Sources');
	}
	fs.writeFileSync('build/Sources/ManifestResources.hx', mr, 'utf8');
}

let project = new Project('OpenFL Test');
project.addAssets('Assets/**');
project.addSources('Sources');

createApplicationMain();
createManifestResources();
project.addSources('build/Sources');

project.addLibrary('openfl');
project.addLibrary('lime');
project.addLibrary('format');
project.addDefine('tools');
project.addParameter('-main ApplicationMain');
project.addShaders('Libraries/openfl/src/openfl/_internal/renderer/kha/shaders/**');
resolve(project);
