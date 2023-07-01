# tournament-bracket-generator

Houses the tournament-bracket-generator code

#### To install

checkout of master into <devname-branchName> and run `npm install`

#### To run

run `yarn dev` to start the dev server

#### To build

run `yarn build` to build the app

### To check for linting errors

run `yarn lint` to check for linting errors. always run this before pushing to the repo

### GIT

Commits not inline with conventional commits would be rejected.

### Note

In order to scale the application in the easiest and most maintainable way, keep most of the code inside the components folder, which should contain different components-based things. Every component should contain domain specific code for a given feature. This will allow you to keep functionalities scoped to a feature and not mix its declarations with shared things. This is much easier to maintain than a flat folder structure with many files. [bulletProofReact](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)


