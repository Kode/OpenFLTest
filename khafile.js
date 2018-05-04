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

function createManifestResources(dir) {
	let mr = fs.readFileSync('Libraries/lime/templates/haxe/ManifestResources.hx', 'utf8');
	mr = mr.replace(/::if \(assets != null\)::/g, '/*');
	mr = mr.replace(/::foreach/g, '/*');
	mr = mr.replace(/::end::::end::::end::::end::/g, '*/');
	mr = mr.replace(/::end::::end::::end::/g, '*/');
	mr = mr.replace(/::end::::end::/g, '*/');
	mr = mr.replace(/::library::/g, 'default');

	let assets = fs.readdirSync(dir);
	let assetObjects = [];
	for (let asset of assets) {
		assetObjects.push(
			{
				id: dir.toLowerCase() + '/' + asset,
				path: dir.toLowerCase() + '/' + asset,
				preload: true,
				size: 449,
				type: "IMAGE"
			}
		);
	}

	mr = mr.replace(/::manifest::/g,
  'manifest = new lime.utils.AssetManifest();\n'
+ 'manifest.assets = '
+ JSON.stringify(assetObjects)
+ ';\n'
+ 'manifest.libraryArgs = [];\n'
+ 'manifest.libraryType = null;\n'
+ 'manifest.name = null;\n'
+ 'manifest.rootPath = "";\n'
+ 'manifest.version = 2;\n');

	let imagesText = '#if !macro\n';
	for (let asset of assets) {
		imagesText += '@:image("../' + dir + '/' + asset + '") #if display private #end class __ASSET__' + dir.toLowerCase() + '_' + asset.replace(/\./g, '_') + ' extends lime.graphics.Image {}\n'
	}
	imagesText += '#end';

	mr = mr.replace(/::images::/g, imagesText);

	if (!fs.existsSync('build')) {
		fs.mkdirSync('build');
	}
	if (!fs.existsSync('build/Sources')) {
		fs.mkdirSync('build/Sources');
	}
	fs.writeFileSync('build/Sources/ManifestResources.hx', mr, 'utf8');
}

createApplicationMain();
createManifestResources('Assets');

let project = new Project('OpenFL Test');
project.addAssets('Assets/**');
project.addSources('build/Sources');
project.addSources('Sources');
project.addLibrary('openfl');
project.addLibrary('lime');
project.addLibrary('format');
project.addDefine('tools');
project.addParameter('-main ApplicationMain');
project.addShaders('Libraries/openfl/src/openfl/_internal/renderer/kha/shaders/**');
resolve(project);
