import ko from 'knockout';
import * as SysGlobalObservables from 'app/sys-global-observables';

class AutoIncluder {
    constructor() {
        const self = this;
        this.createMapping();

        this.browser = SysGlobalObservables.observableFS;
        this.browser.subscribe((newBrowser) => {
            self.browser = newBrowser;
        });

        this.editor = SysGlobalObservables.observableEditor;
        this.editor.subscribe((newEditor) => {
            self.editor = newEditor;
        });
    }

    createMapping() {
        const self = this;
        const includeMap = {};
        const syscalls = 'https://cs-education.github.io/sysassets/man_pages/syscall_metadata.min.json';
        const libcalls = 'https://cs-education.github.io/sysassets/man_pages/headers.min.json';
        $.getJSON(syscalls, (data) => {
            data.forEach((element) => {
                element.functions.forEach((func) => {
                    includeMap[func.name] = [];
                    element.defines.forEach((define) => {
                        const adding = '#define ' + define.text;
                        if (includeMap[func.name].indexOf(adding) === -1) {
                            includeMap[func.name].push(adding);
                        }
                    });
                    element.includes.forEach((include) => {
                        const adding = '#include <' + include.file_path + '>';
                        if (includeMap[func.name].indexOf(adding) === -1) {
                            includeMap[func.name].push('#include <' + include.file_path + '>');
                        }
                    });
                });
            });
        });
        $.getJSON(libcalls, (data) => {
            for (const key in data) { // eslint-disable-line no-restricted-syntax
                if (!(key in includeMap)) {
                    includeMap[key] = data[key];
                }
            }
            self.includeMap = includeMap;
        });
    }

    loadFile(file) {
        const content = this.browser.fs.readFileSync(file).toString('binary');
        this.browser.makeActive(file);
        this.editor.setFile(file, file.substring(1), content);
    }

    addMissingHeaders(textGetter) {
        const originalGetter = SysGlobalObservables.currentFilePath;
        this.browser.saveActiveFile();
        const updates = {};
        for (const file in this.browser.metaDataPathLookUp) { // eslint-disable-line no-restricted-syntax
            if (file.length === 0 || (file.indexOf('.h') < 0 && file.indexOf('.c') < 0)) {
                continue; // eslint-disable-line no-continue
            }
            this.loadFile(file);
            const getter = textGetter();
            const text = getter().split('\n');
            const session = this.editor.aceEditor.session;
            const length = session.getLength();
            const includeMap = this.includeMap;
            const currentHeaders = [];
            const headers = [];
            for (let row = 0; row <= length; row++) {
                const tokens = session.getTokens(row);
                tokens.forEach((token) => {
                    const syntax = token.value;
                    if (syntax === '#include' || syntax === '#define') {
                        const current = tokens.map((token) => token.value); // eslint-disable-line no-shadow
                        currentHeaders.push(current.join(''));
                    } else if (syntax in includeMap) {
                        includeMap[syntax].forEach((header) => {
                            if (headers.indexOf(header) === -1 && currentHeaders.indexOf(header) === -1) {
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
            headers.forEach((header) => {
                text.unshift(header);
            });
            const final = text.join('\n');
            this.editor.setAceText(final);
            this.browser.saveActiveFile();
        }
    }
}

// TODO add an editor annotation
// TODO add unit & integration testing

export default AutoIncluder;
