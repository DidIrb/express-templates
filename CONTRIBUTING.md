# Contributing to Exird JS

Thank you for considering contributing to Exird JS! We welcome contributions from the community and are excited to see what you will bring to the project.

## Project Structure

Here's an overview of the project structure:

```
exirdjs
├── templates
│   ├── typescript
│   └── javascript
├── packages
│   ├── create-exird
│   └── exird
└── documentation
```


| Path                    | Description                                                   |
| ----------------------- | ------------------------------------------------------------- |
| `templates`  | Multiple express based templates for scaffolding.                          |
| `packages/create-exird` | Package for scaffolding Express applications.                 |
| `packages/exird`        | Exirdjs CLI tool with multiple functionalities including scaffolding. |
| `documentation`         | Built with Next.js and Fumadocs, this is where the documentation for ExirdJS resides. |

## Getting Started

To get started with contributing, follow these steps:

1. **Fork the repository**: Click the "Fork" button at the top right of the repository page.
2. **Clone your fork**: Clone your forked repository to your local machine.
    ```bash
    git clone https://github.com/your-username/exird-js.git
    ```
3. **Install dependencies**: Navigate to the root directory and install the dependencies using pnpm.
    ```bash
    pnpm install
    ```
4. **Create a new branch**: Create a new branch for your feature or bugfix.
    ```bash
    git checkout -b feature/your-feature-name
    ```

## How to Contribute

### Reporting Bugs

If you find a bug, please report it by opening an issue on GitHub. Include as much detail as possible to help us understand and reproduce the issue.

### Suggesting Enhancements

We welcome suggestions for new features or improvements. Please open an issue on GitHub to discuss your ideas.

### Submitting Pull Requests

1. **Make your changes**: Make your changes in your branch.
2. **Test your changes**: Ensure that your changes do not break any existing functionality.
3. **Commit your changes**: Commit your changes with a clear and descriptive message.
    ```bash
    git commit -m "Add feature: description of your feature"
    ```
4. **Push to your fork**: Push your changes to your forked repository.
    ```bash
    git push origin feature/your-feature-name
    ```
5. **Open a pull request**: Open a pull request to the main repository. Provide a clear description of your changes and any related issues.

### Packages

There are 2 packages in this monorepo, `create-exird` and `exird` which is the cli tool, the code is written in typescript as such would need to be built before testing.



> Install the package globally to test it anywhere in your system *for some reason pnpm link does not work so just use*

```bash
npm install -g
```
To test your changes in development run
```bash
 pnpm run build 
```

test the package locally like this 
```bash
create-exird 
```

### Commit Convention

Before you create a Pull Request, please check whether your commits comply with the commit conventions used in this repository.

When you create a commit we kindly ask you to follow the convention `category(scope or module): message` in your commit message while using one of the following categories:

- `feat / feature`: all changes that introduce completely new code or new features
- `fix`: changes that fix a bug (ideally you will additionally reference an issue if present)
- `refactor`: any code related change that is not a fix nor a feature
- `docs`: changing existing or creating new documentation (i.e. README, docs for usage of a lib or cli usage)
- `build`: all changes regarding the build of the software, changes to dependencies or the addition of new dependencies
- `test`: all changes regarding tests (adding new tests or changing existing ones)
- `ci`: all changes regarding the configuration of continuous integration (i.e. github actions, ci system)
- `chore`: all changes to the repository that do not fit into any of the above categories

  e.g. `feat(components): add new prop to the avatar component`

If you are interested in the detailed specification you can visit Conventional Commits or check out the Angular Commit Message Guidelines.

### Documentation

The documentation for this project is located in the `docs` workspace. You can run the documentation locally by running the following command:

```bash
pnpm --filter=docs dev
```

Documentation is written using [MDX](https://mdxjs.com). You can find the documentation files in the `documentations/content/docs` directory.

## Code of Conduct

We expect all contributors to adhere to our Code of Conduct. Please read it to understand the standards of behavior we expect from our community.

### Note

In order to allow for any package manager to be used, we added `.npmrc` in each file and added `save=false` flag to prevent npm from updating package.json files constantly and create package.lock.json files also. 

Now for this reason you will need to install a package,  using the `--save` flag:

```bash
pnpm add express --save
```