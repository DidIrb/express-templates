export const getTsConfig = (format: string): string => `{
  "compilerOptions": {
    "target": "ESNext",
    "module": "${format === "ES6" ? "commonjs" : "commonjs"}",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "typeRoots": [
      "./node_modules/@types",
      "./types"
    ]
  }
}`

export const getGitignore = (): string => `node_modules
.npmrc
.env`

export const getReadme = (language: string): string => `# Express ${language} Template
This is a template for creating an Express.js application using ${language}.`

const TSCode = `import express, { Application, Request, Response } from "express";
const app: Application = express();
const PORT: number = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(\`Server is running on http://localhost:\${PORT}\`);
});`

export const entryFile = (language: string, format: string): string => {
  if (language === "TypeScript" && format === "CommonJS") return TSCode
  if (language === "TypeScript" && format === "ES6") return TSCode

  if (language === "JavaScript" && format === "ES6") {
    return `import express from "express";
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(\`Server is running on http://localhost:\${PORT}\`);
});`
  }

  if (language === "JavaScript" && format === "CommonJS") {
    return `const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(\`Server is running on http://localhost:\${PORT}\`);
});`
  }

  return ""
}
