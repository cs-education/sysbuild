import ko from 'knockout';

export var vmState = ko.observable('');
export var compileStatus = ko.observable('');

export var gccOptions = ko.observable('');
export var programArgs = ko.observable('');

export var runCode = ko.observable((code, gccOptions) => {});

export var lastGccOutput = ko.observable('');
export var gccOptsError =  ko.observable('');
export var gccErrorCount = ko.observable(0);
export var gccWarningCount = ko.observable(0);
export var editorAnnotations = ko.observableArray([]);

export var projectLicense = ko.observable('');
