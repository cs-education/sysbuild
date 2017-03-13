# Continuous Integration (CI)

We use [Travis CI](https://travis-ci.org/) for continuous integration.
Every time a pull request is opened or updated with more commits, a build is triggered.

It is a good idea to test your code locally before opening a pull request,
so as to avoid failed builds and needing to revise the pull request.
Use the following command to run the tests exactly as they are run by Travis CI:

```
./scripts/ci
```


## Travis CI Configuration

* [We cache](/.travis.yml) Bower and npm dependencies to speed up builds.
  The caches can be accessed [on the web](https://travis-ci.org/cs-education/sysbuild/caches),
  which gives us a means to [clear them](http://docs.travis-ci.com/user/caching/#Clearing-Caches)
  in case they are spoiled (for example, by storing bad data in one of the cached directories).

* You can [validate the .travis.yml file](http://docs.travis-ci.com/user/travis-lint/) before committing it to reduce common build errors.
  Travis has a convenient [web-based tool](https://lint.travis-ci.org/) where you can paste the contents of `.travis.yml` for validation.

* You can [skip a Travis CI build](http://docs.travis-ci.com/user/customizing-the-build/#Skipping-a-build) if a build
  is unnecessary for a particular commit.
