# Make My Web

An AI-focused web application that provides an interactive workspace for building, editing, previewing, and exporting React projects.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Development](#development)
- [Available Scripts](#available-scripts)
- [Docker Setup](#docker-setup)
- [CI Pipeline](#ci-pipeline)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Known Limitations](#known-limitations)
- [License](#license)

---

<details>
<summary><strong>Overview</strong></summary>

Make My Web is a frontend application designed to provide an interactive environment for AI-assisted web development.

Users can work with React project files, preview changes in real time, submit prompts for revisions, and export projects for standalone use.

</details>

<details>
<summary><strong>Features</strong></summary>

- User registration and login interfaces with form validation.
- Protected application routes.
- Dashboard for viewing and managing projects.
- Interactive project builder.
- File explorer and code editor.
- Live preview of project code.
- Runtime error monitoring.
- Prompt-based project revision interface.
- Agent progress visualization.
- Automatic saving of code changes with debouncing.
- Export projects as ZIP files.
- Publish modal and public project view.

</details>

<details>
<summary><strong>Technology Stack</strong></summary>

| Technology | Purpose |
|---|---|
| React 19 | User interface |
| Vite 8 | Development server and build tooling |
| Tailwind CSS 4 | Styling |
| React Router DOM 7 | Client-side routing |
| Sandpack | Code editing and live preview |
| Axios | HTTP client |
| Zod | Form and data validation |
| JSZip | ZIP file generation |
| FileSaver | Browser file downloads |
| Lodash Debounce | Debounced code saving |
| React Hot Toast | Notifications |
| Lucide React | Icons |
| Oxlint | Linting |
| Prettier | Code formatting |

</details>

<details>
<summary><strong>Project Structure</strong></summary>

```text
Make_My_Web/
├── .github/
│   └── workflows/
│       └── ci.yml
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── context/
│   │   ├── errors/
│   │   ├── hook/
│   │   ├── layouts/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── service/
│   │   ├── utils/
│   │   └── validations/
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

</details>

<details>
<summary><strong>Prerequisites</strong></summary>

Ensure the following tools are installed:

- Node.js 22
- npm
- Git
- Docker (optional, for containerized development and deployment)

</details>

<details>
<summary><strong>Installation</strong></summary>

Clone the repository:

```bash
git clone <repository-url>
cd Make_My_Web
```

Navigate to the frontend directory and install dependencies:

```bash
cd client
npm install
```

</details>

<details>
<summary><strong>Environment Configuration</strong></summary>

### ENV

**Status:** No environment configuration has been added at this time.

The `client/.env` file is currently empty and reserved for environment variables that may be required in the future.

Add new environment variables here when needed.

</details>

<details>
<summary><strong>Development</strong></summary>

Start the Vite development server from the `client` directory:

```bash
npm run dev
```

Open the local URL displayed in the terminal. By default, Vite uses:

```text
http://localhost:5173
```

### Production Build

Generate the production build:

```bash
npm run build
```

The generated files are placed in `client/dist`.

### Preview the Production Build

```bash
npm run preview
```

</details>

<details>
<summary><strong>Available Scripts</strong></summary>

Run these commands from the `client` directory.

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Generate the production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |
| `npm run lint:fix` | Automatically fix supported lint issues |
| `npm run format` | Format files using Prettier |
| `npm run format:check` | Check formatting without modifying files |
| `npm run docker:dev:build` | Build the development Docker image |
| `npm run docker:dev:run` | Run the development container |
| `npm run docker:prod:build` | Build the production Docker image |
| `npm run docker:prod:run` | Run the production container |

</details>

<details>
<summary><strong>Docker Setup</strong></summary>

Docker provides separate configurations for frontend development and production deployment.

### 1. Development

Uses Vite to run the frontend during development.

Build the development image:

```bash
docker build -t myw-client-dev -f Dockerfile.dev .
```

Run the development container:

```bash
docker run --rm -it --name myw-client-dev-container -p 3000:5173 myw-client-dev
```

Access the application at:

```text
http://localhost:3000
```

### 2. Production / Deployment

The production Dockerfile builds the frontend and uses Nginx to serve the generated static files.

Build the production image:

```bash
docker build -t myw-client -f Dockerfile .
```

Run the production container:

```bash
docker run -d --name myw-client-container -p 3001:80 myw-client
```

Access the application at:

```text
http://localhost:3001
```

### 3. CI Pipeline

- CI builds the production Docker image using `Dockerfile`.
- The development image using `Dockerfile.dev` is not built in CI.

### 4. Docker Command Reference

#### Build an Image

```bash
docker build -t imagename -f filename .
```

- `docker build` — Builds an image from a Dockerfile.
- `-t imagename` — Assigns a name to the image.
- `-f filename` — Specifies the Dockerfile.
- `.` — Sets the current directory as the build context.

Example:

```bash
docker build -t myw-client-dev -f Dockerfile.dev .
```

#### Run a Container

Development:

```bash
docker run --rm -it --name myw-client-dev-container -p 3000:5173 myw-client-dev
```

Production:

```bash
docker run -d --name myw-client-container -p 3001:80 myw-client
```

Command options:

| Option | Description |
|---|---|
| `--rm` | Remove the container automatically after it stops |
| `-it` | Enable interactive terminal use |
| `-d` | Run the container in the background |
| `--name` | Assign a container name |
| `-p host:container` | Map a host port to a container port |
| `3000:5173` | Map local port 3000 to container port 5173 |
| `3001:80` | Map local port 3001 to container port 80 |

#### Container and Image Management

List running containers:

```bash
docker ps
```

List all containers:

```bash
docker ps -a
```

View container logs:

```bash
docker logs container_name
```

Follow logs continuously:

```bash
docker logs -f container_name
```

Stop a running container:

```bash
docker stop container_name
```

Start an existing stopped container:

```bash
docker start container_name
```

Remove a stopped container:

```bash
docker rm container_name
```

Remove an image:

```bash
docker rmi image_name
```

#### Rebuild After Code Changes

For development, source changes can appear automatically when the development setup supports Vite hot reload.

For production, rebuild the image and recreate the container:

```bash
docker build -t myw-client -f Dockerfile .
docker stop myw-client-container
docker rm myw-client-container
docker run -d --name myw-client-container -p 3001:80 myw-client
```

**Reminder:** Rebuilding an image does not update a container that is already running. Recreate the container to use the newly built image.

### 5. Docker npm Scripts

The following scripts are available in `client/package.json`:

#### Development

```bash
npm run docker:dev:build
npm run docker:dev:run
```

#### Production

```bash
npm run docker:prod:build
npm run docker:prod:run
```

These scripts run the equivalent Docker commands without requiring you to type them manually.

</details>

<details>
<summary><strong>CI Pipeline</strong></summary>

The GitHub Actions workflow is defined in `.github/workflows/ci.yml`.

The workflow runs on:

- Pushes to any branch.
- Pull requests targeting `main`.

The frontend CI job performs the following steps:

1. Checks out the repository.
2. Sets up Node.js 22.
3. Installs dependencies using `npm ci`.
4. Runs linting with `npm run lint`.
5. Checks formatting with `npm run format:check`.
6. Builds the frontend with `npm run build`.
7. Builds the production Docker image.

Automated tests are not currently part of the pipeline.

</details>

<details>
<summary><strong>Testing</strong></summary>

**Status:** Automated tests have not yet been implemented.

Potential future additions include:

- Vitest for unit tests.
- React Testing Library for component tests.
- Playwright for end-to-end tests.

</details>

<details>
<summary><strong>Code Quality</strong></summary>

Before submitting changes, run the following checks from the `client` directory:

```bash
npm run lint
npm run format:check
npm run build
```

To format the files automatically:

```bash
npm run format
```

To fix supported lint issues automatically:

```bash
npm run lint:fix
```

</details>

<details>
<summary><strong>Known Limitations</strong></summary>

- Real AI model integration is not yet implemented.
- Automated tests are not yet configured.
- The project may require further refactoring as development continues.

</details>

<details>
<summary><strong>License</strong></summary>

A project license has not yet been confirmed. Add a `LICENSE` file and update this section when the license is decided.

</details>
