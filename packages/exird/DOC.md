```
npx exird init
```

When initializing exird project it will need to do this steps

- create `.exird/workflows` folder
- create `.exird/exird.config.json` file
- create `.exird/workflows/exirdjs.yml` folder

This will check a project for the following

```mermaid
graph TD
    A[exird init] --> B{Folder empty?}
    B -- Yes --> F[default-setup]
    B -- No --> C{Has package.json?}
    C -- Yes --> D{Has express?}
    C -- No --> E[Prompt: Setup in current folder or create new folder?]
    D -- Yes --> H[setup-exird]
    D -- No --> G[Error: Not exird project]
    H --> I{Module defined?}
    I -- No --> J[Prompt module system]
    I -- Yes --> K[Set moduleSystem: es6]
    J --> K
    K --> L{Has package manager?}
    L -- Yes --> M[Set package manager]
    L -- No --> N[Prompt package manager]
    M --> O{Has TypeScript?}
    N --> O
    O -- Yes --> P[Set lang: TypeScript]
    O -- No --> Q[Prompt lang]
    P --> R{Has ESLint?}
    Q --> R
    R -- Yes --> S[Set ESLint: true]
    R -- No --> T[Set ESLint: false]
    S --> U[Complete setup]
    T --> U

```

### Actions

Actions are code snippets that run commands and make changes to the code base.

The above flow chart can actually be placed inside an action
we are going to actually set it up

This is how actions work

## // oudated approach

- Create folder with the name of the action e.g. `setup-exird`
- Create action.ts folder as entry point into action.
- Create scripts.ts folder

It will get the local workflows and ask you which one you want to run if
there is more than one

```
exird run <action>
```

Actions now work in a simpler way
