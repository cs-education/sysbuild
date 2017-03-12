# Git Commit Message Guidelines

Commit messages are crucial to establishing context around a particular change.
"A diff will tell you what changed, but only the commit message can properly tell you why" [1].
This becomes even more important in our case, where we have multiple groups of students working on the project in succession.
Adhering to the guidelines in this page will go a long way towards ensuring maintainability and success of this project.


## Formatting and Style

Commit messages should have the following form:
```
<subject>      <-- mandatory
               <-- mandatory blank line if body is present
<body>         <-- optional, but recommended
```

Please follow the below formatting and style rules (from [1]).

The subject line should
* not be more than 50 characters
* start with a capital letter
* not end with a period
* be written in the [imperative mood](http://chris.beams.io/posts/git-commit/#imperative)

The message body should
* be separated from the subject with a blank line
* be wrapped at 72 characters
* be used to explain what and why vs. how


## Message Content

Try to have a story in the commit message instead, so that `git log` provides a good history
for the project. One way to do this is to use plain `git commit` instead of `git commit -m "..."`.
This will open up an editor where you can write more freely. [You can use an editor of your choice]
(https://help.github.com/articles/associating-text-editors-with-git/). From [2]:

> Never use the `-m <msg>` / `--message=<msg>` flag to `git commit`.

> It gives you a poor mindset right off the bat as you will feel that you have to fit your commit message into the terminal command,
> and makes the commit feel more like a one-off argument than a page in history:

> ```
> git commit -m "Fix login bug"
> ```

> A more useful commit message might be:

> ```
> Redirect user to the requested page after login

> https://trello.com/path/to/relevant/card

> Users were being redirected to the home page after login, which is less
> useful than redirecting to the page they had originally requested before
> being redirected to the login form.

> * Store requested path in a session variable
> * Redirect to the stored location after successfully logging in the user
> ```


## A Model Commit Message

From [3]:
```
Capitalized, short (50 chars or less) summary

More detailed explanatory text, if necessary.  Wrap it to about 72
characters or so.  In some contexts, the first line is treated as the
subject of an email and the rest of the text as the body.  The blank
line separating the summary from the body is critical (unless you omit
the body entirely); tools like rebase can get confused if you run the
two together.

Write your commit message in the imperative: "Fix bug" and not "Fixed bug"
or "Fixes bug."  This convention matches up with commit messages generated
by commands like git merge and git revert.

Further paragraphs come after blank lines.

- Bullet points are okay, too

- Typically a hyphen or asterisk is used for the bullet, followed by a
  single space, with blank lines in between, but conventions vary here

- Use a hanging indent
```


## References

1. [_How to Write a Git Commit Message_ by Chris Beams](http://chris.beams.io/posts/git-commit/)
2. [_5 Useful Tips For A Better Commit Message_ on the thoughtbot blog](https://robots.thoughtbot.com/5-useful-tips-for-a-better-commit-message)
3. [_A Note About Git Commit Messages_ by Tim Pope](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)
