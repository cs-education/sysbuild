# Module Hierarchy and Architecture

The web application is made of several modules. In particular, the User Interface is composed of small,
self-contained [Knockout components](http://knockoutjs.com/documentation/component-overview.html).
To make it easier to understand how these components are organized,
the diagram below shows how each component is consumed and instantiated by other components,
as well as how they interact with other modules.

In this diagram, the white boxes represent the UI components present in the `src/components/` directory
(with the exception of `index.html`, which is the point of entry into the app and is not a Knockout component),
while the gray boxes represent the "core" [singleton](https://en.wikipedia.org/wiki/Singleton_pattern) modules present in the `src/app/` directory.

***

![c playground module hierarchy diagram](/docs/c_playground/module_hierarchy.png)

***

The diagram is accurate as of commit [7fb202f68eb8264034207075647d9a403af83753](https://github.com/cs-education/sysbuild/commit/7fb202f68eb8264034207075647d9a403af83753),
and is bound to become outdated as more components are added. However, an attempt will be made to update the diagram whenever major changes are introduced.


## Download the diagram:

* [PDF](/docs/c_playground/module_hierarchy.pdf)
* [PNG](/docs/c_playground/module_hierarchy.png)
* [Source](/docs/c_playground/module_hierarchy.xml) (which can be opened in [draw.io](https://www.draw.io/), the tool used to create this diagram)
