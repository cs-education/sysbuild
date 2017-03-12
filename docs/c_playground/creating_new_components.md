# Creating New Components

To create a new [Knockout component](http://knockoutjs.com/documentation/component-overview.html) called "my-component",
the following steps need to be followed:

1.  Create the following files:
    * `src/components/my-component/my-component.html`: The HTML template for the component
    * `src/components/my-component/my-component.js`: The ViewModel for the component
    * `src/styles/_my-component.scss`: The Sass partial containing styles for the component

2.  Register the component with Knockout by adding the following line to `src/app/startup.js`:

    ```js
    ko.components.register('my-component', { require: 'components/my-component/my-component' });
    ```

3.  Include the component styles by importing the Sass partial into `src/styles/main.scss`:

    ```sass
    @import "styles/my-component";
    ```

4.  Update the build configuration in `gulp-tasks/build-js.js` so that the new component is included
    in the distribution bundle, by adding `'components/my-component/my-component'` to the include list.

5.  Use the component as needed, usually as a custom HTML element. For example:

    ```html
    <my-component params="..."></my-component>
    ```
