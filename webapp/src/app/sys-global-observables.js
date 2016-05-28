import ko from 'knockout';

export const vmState = ko.observable('');
export const compileStatus = ko.observable('');

export const focusTerm = ko.observable((tty) => {});
export const runCode = ko.observable((gccOptions) => {});

export const buildCmd = ko.observable('');
export const execCmd = ko.observable('');

export const lastGccOutput = ko.observable('');
export const gccOptsError = ko.observable('');
export const gccErrorCount = ko.observable(0);
export const gccWarningCount = ko.observable(0);
export const editorAnnotations = ko.observableArray([]);

export const currentFileName = ko.observable('untitled');
export const currentFilePath = ko.observable('');
export const compileBtnEnable = ko.observable('');

export const projectLicense = ko.observable('');

export const Editor = {};
export const FileBrowser = {};
