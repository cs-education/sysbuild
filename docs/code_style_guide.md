# Code Style Guide


## General

* Include tests whenever possible.

* Make sure all tests pass.

* We have an [editor config file](.editorconfig) for maintaining a consistent coding style.
  Read more and download plugins at [editorconfig.org](http://editorconfig.org).

* The git pre-commit hook (installed during setup) will automatically run code linters
  to help you adhere to the these code style guidelines.


## HTML

* Adhere to the [HTML Code Guide by @mdo](http://codeguide.co/#html).

* Use tags and elements appropriate for an HTML5 doctype (e.g., self-closing tags).

* Download JS scripts using Bower to be included in the distribution, instead of loading them from third-party URLs.

* If you have to use third-party JS, use CDNs and HTTPS when possible.

* Use [WAI-ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) attributes to promote accessibility.


## CSS

* Adhere to the [CSS Code Guide by @mdo](http://codeguide.co/#css).

* When feasible, default color palettes should comply with
  [WCAG color contrast guidelines](http://www.w3.org/TR/WCAG20/#visual-audio-contrast).


## JavaScript

* Adhere to the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).

* We use [ESLint](http://eslint.org/) to detect errors and potential problems in JavaScript code.
  Use `gulp lint` in the `webapp` directory to run ESLint on your code.

* [ESLint can be suppressed](http://eslint.org/docs/user-guide/configuring#configuring-rules)
  in particular parts of code when necessary. Use this sparingly, though.

* Do not wrap your AMD modules in `define` calls, as Babel automatically does that.
  In fact, doing so will cause errors. Use ES6 `import` statements for specifying dependencies.


**NOTE**: If you encounter any code not adhering to these guidelines,
feel free to open an issue, or better, open a (separate) pull request fixing the violations.
Also feel free to discuss changing/adding/removing any guideline if you have a compelling reason for it.
