import * as SysGlobalObservables from 'app/sys-global-observables'

class AutoIncluder {
	constructor() {
		var self = this;
		this.createMapping();
	}

	createMapping() {
		var includeMap = {};
        $.getJSON("https://cs-education.github.io/sysassets/man_pages/syscall_metadata.min.json", function(data) {
            data.forEach(function(element) {
                element.functions.forEach(function(func) {
                    includeMap[func.name] = [];
                    element.defines.forEach(function(define) {
                    	var adding = "#define " + define.text;
                        if (includeMap[func.name].indexOf(adding) == -1) {
                        	includeMap[func.name].push(adding);
                        }
                    });
                    element.includes.forEach(function(include) {
                    	var adding = "#include <" + include.file_path + ">";
                    	if (includeMap[func.name].indexOf(adding) == -1) {
                        	includeMap[func.name].push("#include <" + include.file_path + ">");
                    	}
                    });
                });
            });
        });
  		$.getJSON("components/editor/headers.JSON", function(data) {
  			for (var key in data) {
  				if (!(key in includeMap)) {
  					includeMap[key] = data[key];
  				}
  			};
  			console.log(includeMap);
            self.IncludeMap = includeMap;
  		});
	}

	addMissingHeaders(params) {
        var getter = params.editorParams.editorTextGetter();
        var text = getter().split('\n');
        var editor = SysGlobalObservables.Editor.aceEditor;
        var session = editor.session;
        var length = session.getLength();
        var includeMap = self.IncludeMap;
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
                	    }
                	});
            	}
            });
        }
        headers.forEach(function(header) {
            text.unshift(header);
        });
        var final = text.join('\n');
        SysGlobalObservables.Editor.setAceText(final);
	}
}

export default AutoIncluder;
