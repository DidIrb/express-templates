## Exirdjs

This is a tool that will allow backend developers using express to build applications by using prebuilt code snippets, allowing quicker project delivery.

This file contains things the user is required to do in this project.

### Upcoming

- [ ] Set up Testing before build.
- [ ] Add Code of conduct
- [ ] Add Security Policy
- [ ] Set up version control for the packages.
- [ ] Update github actions for exird to update version of exird-addons
- [x] Set up add-ons package
- [x] Update exird package to show metadata
- [x] Enable create-exird package to allow for additional flags like 
    - [x] --typescript.
    - [x] --javascript.
    - [x] --version,-V, --v, -v.
    - [x] --help , -h, --h, -h.
    - **Expected Behavior** npm create exird@latest project-name --typescript
- [x] Set up docs for project.
- [x] Update cli to check if empty then run scaffolding
- [ ] Allow user to build on top of the existing code
- [ ] Enable user to set up db connection
- [ ] Transfer todo's to github projects for more efficient handling
- [ ] Create landing page for exirdjs in documentation/ exirdjs site.
- [ ] Check for packages that are not being used inside the packages

### Initialization
- [x] Initialize a basic cli tool.
- [x] Initialize scaffolding package
- [x] Set up base express javascript template.
- [x] Set up base express typescript template.
- [x] Prepare package for deployment through github actions.
- [x] Initialize documentation for exirdjs
- [x] Initialize website for exirdjs
 
## Templates
- [ ] Configure project to allow it to change port number if it is not available.
- [ ] Set up method to ensure files are saved and installed in the right place.

### Handle Errors in the cli tool
- [x] Check if new directory is empty before installing throwing appropriate errors.
- [x] During install ask the user what they should call their code base or use . to specify that path to install it to.
- [x] Remove files that are not wanted, node_modules, .npmrc, etc.
- [x] Add types to the cli tool.
- [x] Allow user to cancel and exit operation using cntr+c

## Styling
- [ ] Add spinner while packages are being installed.

### Guide
- [ ] Guide the users in how to use the cli tool.
- [x] Set it up in such a way that users can run npm create exird | **partially done**
- [ ] Improve the prompt for users to use the package to install it globally or in the specific project.

## Documentation
- [x] Start the documentation of the cli tool.
- [x] Create and update readme-file
- [ ] Create and update contributions file
- [ ] Update license
- [ ] Write a getting started guide for the tool
- [ ] Document Milestones you want to achieve with this project

### Deployment
- [x] Deploy the package to npm.
- [ ] Update the project to navigate to the appropriate file locations.