import ko from 'knockout';
import * as SysGlobalObservables from 'app/sys-global-observables';

class AutoIncluder {
	constructor() {
		var self = this;
		this.createMapping();

		this.browser = SysGlobalObservables.ObservableFS;
		this.browser.subscribe((newBrowser) => self.browser = newBrowser);

		this.editor = SysGlobalObservables.ObservableEditor;
		this.editor.subscribe((newEditor) => self.editor = newEditor);
	}

	createMapping() {
		var self = this;
		var includeMap = {};
		$.getJSON('https://cs-education.github.io/sysassets/man_pages/syscall_metadata.min.json', function(data) {
			data.forEach(function(element) {
				element.functions.forEach(function(func) {
					includeMap[func.name] = [];
					element.defines.forEach(function(define) {
						var adding = '#define ' + define.text;
						if (includeMap[func.name].indexOf(adding) == -1) {
							includeMap[func.name].push(adding);
						}
					});
					element.includes.forEach(function(include) {
						var adding = '#include <' + include.file_path + '>';
						if (includeMap[func.name].indexOf(adding) == -1) {
							includeMap[func.name].push('#include <' + include.file_path + '>');
						}
					});
				});
			});
		});
		$.getJSON('https://cs-education.github.io/sysassets/man_pages/headers.min.json', function(data) {
			for (var key in data) {
				if (!(key in includeMap)) {
					includeMap[key] = data[key];
				}
			}
			self.includeMap = includeMap;
		});
	}

	loadFile(file) {
		var content = this.browser.fs.readFileSync(file).toString('binary');
		this.browser.makeActive(file);
		this.editor.setFile(file, file.substring(1), content);
	}

	addMissingHeaders(textGetter) {
		var originalGetter = SysGlobalObservables.currentFilePath;
		var originalFile = originalGetter();
		var updates = {};
		for (var file in this.browser.metaDataPathLookUp) {
			if (file.length === 0 || (file.indexOf('.h') < 0 && file.indexOf('.c') < 0)) continue;
			this.loadFile(file);
			var getter = textGetter();
			var text = getter().split('\n');
			var session = this.editor.aceEditor.session;
			var length = session.getLength();
			var includeMap = this.includeMap;
			var currentHeaders = [];
			var headers = [];
			for (var row = 0; row <= length; row++) {
				var tokens = session.getTokens(row);
				tokens.forEach(function(token) {
					var syntax = token.value;
					if (syntax === '#include' || syntax === '#define') {
						var current = tokens.map(function(token) {
							return token.value;
						});
						currentHeaders.push(current.join(''));
						return;
					} else if (syntax in includeMap) {
						includeMap[syntax].forEach(function(header) {
							if (headers.indexOf(header) == -1 && currentHeaders.indexOf(header) == -1) {
								headers.push(header);
								if (header in updates) {
									updates[header].push(file.substring(1));
								} else {
									updates[header] = [file.substring(1)];
								}
							}
						});
					}
				});
			}
			headers.forEach(function(header) {
				text.unshift(header);
			});
			var final = text.join('\n');
			this.editor.setAceText(final);
			this.browser.saveActiveFile();
		}
		this.loadFile(originalFile);
	}
}

// TODO add an editor annotation
// TODO add unit & integration testing

export default AutoIncluder;