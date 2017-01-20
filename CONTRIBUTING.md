# Contributing

Please be familar with the [GitHub Community Guidelines](https://help.github.com/articles/github-community-guidelines/) before contributing to this project. If you are new to open source, check out this 38 minute course on [how to contribute to open source on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github).

## Getting Started

1. Clone the repository
2. Go to source folder: `$ cd ziya/src/`
3. Install dependencies: `$ npm install`
4. Run environment in development mode: `$ npm run start:dev`
5. Build App for Production: `$ npm run build`
6. Run environment in production mode: `$ npm run start:prod`

## Need Help? :raising_hand:

It's okay to ask for help via a GitHub issue, but first read the ["Filing an Issue"](#filing-an-issue) guide and consider:

* Is my issue specific to this project?
* Is [StackOverflow](http://stackoverflow.com/questions/ask) a better place to ask for help? If yes, use the **#react**, **#express** and/or **#webpack** tags.
* Can I reduce the code example to the bare minimum required to explain what I need help with?
* Can I create a [JSBin](https://jsbin.com/?html,output) for the code example?
* Can I explain what the expected behavior is?
* Can I explain what the actual beavior is?

## Found a Bug?

**Yes, we know that the best bug report is a failing test in the repository as a pull request.** Please refer to the ["Filing an Issue"](#filing-an-issue) guide and include:

* Version number
* Steps to reproduce
* Expected behavior
* Actual behavior

## Have a Feature Request?

If you have a feature request, provide commentary and code samples on what this feature means for you.

* What do you perceive it will enable you to do?
* What potential bugs will be avoided?
* What edge cases will it support?
* Is it a [micro-optimization](http://stackoverflow.com/questions/tagged/micro-optimization). If yes, is it a valuable?

Please refer to the ["Filing an Issue"](#filing-an-issue) guide.

## Filing an Issue

1. Check if a related open issue exists by using search. See the GitHub guide to [searching issues](https://help.github.com/articles/searching-issues/).
2. If a related issue does *not* exist, open an issue.
3. If a related issue does exist, contribute to the conversation there.

Before you create an issue, consider:

* Did you describe the problem you are encountering?
* Did you describe the expected behavior?
* Did you provide a formatted code example? See the GitHub guide on [how to format code with Markdown](help.github.com/categories/writing-on-github/).
* Did you include a relevant label?

If you include all of the above, it is easier to understand you. We respond quicker to formatted, comprehensive issues.

Please keep in mind that issues should *contribute* to the community. The primary function of issues should be for bugs and feature requests. If you open an issue asking for help, that's fine. However, if you do not provide context or code examples, the issue will be closed and you will be redirected to this document.

## Making a Contribution

1. Check [the issues](https://github.com/hwclass/ziya/issues) for "help wanted" or "discussion" labels.
2. Check if there is a pull request already open for this issue. If there is, please do not duplicate efforts.
3. Commit the changes required to resolve the issue. Git commit messages [should be written in the imperative](http://chris.beams.io/posts/git-commit/). A pre-commit hook will run tests and lint code. If needed, you can force a commit with `--no-verify`.
4. If needed, add one or more unit test(s). **For new features and bug fixes, a unit test is required.** Follow the [red/green/refactor process](https://en.wikipedia.org/wiki/Test-driven_development#Development_style).
5. Code is linted using ES Lint. Rules are located in `.eslintrc`. You must maintain the existing code style. **Tests must pass before the PR is merged.**
6. Document new features and/or API changes.

If you add a new dependency (for the package or development), you will actually need to use [npm](https://www.npmjs.org)

## File organization

All code is written in next-generation JavaScript and transpiled using Babel. Source files are located in `src` and transpiled to `dist`, which is gitignored.

** Tests will be added and placed in a `test` directory.**

## Contributors

- [Barış Güler](http://github.com/hwclass)
- [Altay Aydemir](https://github.com/altayaydemir)
