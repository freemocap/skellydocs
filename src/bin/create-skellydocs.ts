import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Handlebars from "handlebars";
import prompts from "prompts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// From dist/bin/ we need to go up two levels to reach the package root where templates/ lives
const PKG_ROOT = path.resolve(__dirname, "..", "..");
const TEMPLATES_DIR = path.join(PKG_ROOT, "templates");

/** Read our own package.json version so templates always match the installed CLI */
function getOwnVersion(): string {
  const pkgPath = path.join(PKG_ROOT, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  return pkg.version as string;
}

const PROMPTS_CANCEL = {
  onCancel: () => {
    throw new Error("Aborted");
  },
};

/** Extracts the org/owner from a URL (the second-to-last path segment) */
function extractOrgName(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, "").replace(/\.git$/, "");
  const segments = trimmed.split("/").filter(Boolean);
  if (segments.length >= 2) {
    return segments.at(-2)!;
  }
  return "";
}

/**
 * Build a Docusaurus editUrl from a repo URL.
 * Supports GitHub, GitLab, and Codeberg-style URLs (/tree/main/ or /-/tree/main/).
 * Returns empty string if the URL doesn't look like a known forge.
 */
function buildEditUrl(repoUrl: string, docsDir: string): string {
  if (!repoUrl) return "";
  try {
    const u = new URL(repoUrl);
    const host = u.hostname.toLowerCase();
    if (host.includes("gitlab")) {
      return `${repoUrl.replace(/\/+$/, "")}/-/tree/main/${docsDir}/`;
    }
    // GitHub, Codeberg, Gitea, and most other forges use /tree/main/
    return `${repoUrl.replace(/\/+$/, "")}/tree/main/${docsDir}/`;
  } catch {
    return "";
  }
}

interface UserInput {
  projectName: string;
  repoUrl: string;
  projectUrl: string;
  logoPath: string;
}

async function promptUser(): Promise<UserInput> {
  const cwdName = path.basename(process.cwd());

  const { projectName } = await prompts(
    {
      type: "text",
      name: "projectName",
      message: "Project name",
      initial: cwdName,
      validate: (v: string) => v.trim().length > 0 || "Required",
    },
    PROMPTS_CANCEL,
  );

  const { repoUrl } = await prompts(
    {
      type: "text",
      name: "repoUrl",
      message: "Source code URL (GitHub, GitLab, Codeberg, etc. — leave blank to skip)",
    },
    PROMPTS_CANCEL,
  );

  const { projectUrl } = await prompts(
    {
      type: "text",
      name: "projectUrl",
      message: "Project website URL (leave blank to skip)",
    },
    PROMPTS_CANCEL,
  );

  const { logoPath } = await prompts(
    {
      type: "text",
      name: "logoPath",
      message: "Path to a logo file (leave blank for default skeleton logo)",
      validate: (v: string) => {
        if (!v.trim()) return true;
        if (!fs.existsSync(v.trim())) return `File not found: ${v.trim()}`;
        return true;
      },
    },
    PROMPTS_CANCEL,
  );

  // Normalize bare "org/repo" slugs into full GitHub URLs
  let normalizedRepoUrl = (repoUrl as string).trim();
  if (normalizedRepoUrl && !normalizedRepoUrl.includes("://")) {
    // Looks like "org/repo" or "org/repo" — prepend GitHub URL
    normalizedRepoUrl = `https://github.com/${normalizedRepoUrl}`;
  }

  return {
    projectName: (projectName as string).trim(),
    repoUrl: normalizedRepoUrl,
    projectUrl: (projectUrl as string).trim(),
    logoPath: (logoPath as string).trim(),
  };
}

function renderTemplate(templateName: string, data: Record<string, string>): string {
  const templatePath = path.join(TEMPLATES_DIR, templateName);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }
  const source = fs.readFileSync(templatePath, "utf-8");
  const template = Handlebars.compile(source);
  return template(data);
}

function writeFile(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`  created ${path.relative(process.cwd(), filePath)}`);
}

function copyFile(src: string, dest: string): void {
  const dir = path.dirname(dest);
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`  created ${path.relative(process.cwd(), dest)}`);
}

async function main(): Promise<void> {
  const command = process.argv[2];

  if (command === "init" || !command) {
    await runInit();
  } else {
    console.error(`Unknown command: ${command}`);
    console.error("Usage: skellydocs init");
    process.exit(1);
  }
}

async function runInit(): Promise<void> {
  console.log("\n🦴 skellydocs — scaffold a new docs site\n");

  const { projectName, repoUrl, projectUrl, logoPath } = await promptUser();

  const orgName = repoUrl ? extractOrgName(repoUrl) : "";
  const repo = orgName ? `${orgName}/${projectName}` : projectName;
  const docsDir = `${projectName}-docs`;
  const targetDir = path.resolve(`./${docsDir}`);
  const editUrl = buildEditUrl(repoUrl, docsDir);

  // Docusaurus `url` must be just the origin (no path). Extract it from the
  // project website if provided, otherwise fall back to a placeholder.
  let siteUrl = `https://${orgName || projectName}.github.io`;
  if (projectUrl) {
    try {
      const u = new URL(projectUrl);
      siteUrl = u.origin;
    } catch {
      siteUrl = projectUrl;
    }
  }

  const isoDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // Is the scaffolded site being created directly inside the skellydocs package?
  const isLocalDev = path.resolve(targetDir, "..") === PKG_ROOT;

  const templateData: Record<string, string> = {
    projectName,
    orgName,
    repo,
    repoUrl,
    projectUrl,
    editUrl,
    siteUrl,
    baseUrl: `/${projectName}/`,
    skellydocsVersion: getOwnVersion(),
    skellydocsDep: isLocalDev ? "file:.." : `^${getOwnVersion()}`,
    isoDate,
  };

  console.log(`\nScaffolding ${docsDir}...\n`);

  // --- Config files ---
  writeFile(
    path.join(targetDir, "package.json"),
    renderTemplate("package.json.hbs", templateData),
  );

  writeFile(
    path.join(targetDir, "docusaurus.config.ts"),
    renderTemplate("docusaurus.config.ts.hbs", templateData),
  );

  writeFile(
    path.join(targetDir, "content.config.tsx"),
    renderTemplate("content.config.tsx.hbs", templateData),
  );

  writeFile(
    path.join(targetDir, "sidebars.ts"),
    `import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';\n\nconst sidebars: SidebarsConfig = {\n  docsSidebar: [{type: 'autogenerated', dirName: '.'}],\n};\n\nexport default sidebars;\n`,
  );

  writeFile(
    path.join(targetDir, "tsconfig.json"),
    JSON.stringify(
      {
        extends: "@docusaurus/tsconfig",
        compilerOptions: {
          baseUrl: ".",
        },
      },
      null,
      2,
    ) + "\n",
  );

  // --- Content ---
  writeFile(
    path.join(targetDir, "docs", "intro.mdx"),
    renderTemplate("docs/intro.mdx.hbs", templateData),
  );

  writeFile(
    path.join(targetDir, "docs", "ai-generated-banner.mdx"),
    renderTemplate("docs/ai-generated-banner.mdx.hbs", templateData),
  );

  writeFile(
    path.join(targetDir, "blog", `${isoDate}_welcome.mdx`),
    renderTemplate("blog/init.mdx.hbs", templateData),
  );

  // --- Pages ---
  const pagesDir = path.join(targetDir, "src", "pages");

  writeFile(
    path.join(pagesDir, "index.tsx"),
    `import { IndexPage } from '@freemocap/skellydocs';\nimport config from '../../content.config';\n\nexport default function Home() {\n  return <IndexPage config={config} />;\n}\n`,
  );

  writeFile(
    path.join(pagesDir, "roadmap.tsx"),
    `import { RoadmapPage, collectLinkedUrls } from '@freemocap/skellydocs';\nimport config from '../../content.config';\n\nconst REPO = '${repo}';\n\nexport default function Roadmap() {\n  return <RoadmapPage repo={REPO} pinnedIssues={collectLinkedUrls(config)} />;\n}\n`,
  );

  // --- Static assets ---
  const logoDestination = path.join(targetDir, "static", "img", "logo.svg");
  if (logoPath) {
    copyFile(logoPath, logoDestination);
  } else {
    const defaultLogo = path.join(TEMPLATES_DIR, "static", "img", "logo.svg");
    copyFile(defaultLogo, logoDestination);
  }

  // --- Done ---
  const logoNote = logoPath
    ? `Your logo was copied from ${logoPath}`
    : "A placeholder logo was added — swap it with your own any time";

  console.log(`
✅ ${docsDir} is ready!

  Get started:

    cd ${docsDir}
    npm install
    npm start

  Customize your site:

    Logo        → static/img/logo.svg
                  ${logoNote}
    Title       → content.config.tsx → hero.title
    Tagline     → content.config.tsx → hero.tagline
    Subtitle    → content.config.tsx → hero.subtitle
    Features    → content.config.tsx → features[]
    Code link   → docusaurus.config.ts → themeConfig.navbar.items

  Linking issues to feature cards:

    Each feature in content.config.tsx has an issues[] array.
    Add entries with a label and the full issue/PR URL:

      features: [
        {
          id: 'my-feature',
          icon: '🚀',
          title: 'My Feature',
          ...
          issues: [
            { label: 'Add streaming support', url: 'https://github.com/${repo}/issues/42' },
            { label: 'Fix edge case', url: 'https://github.com/${repo}/pull/108' },
          ],
        },
      ],

    The same format works for guaranteeIssues[] at the top level.
    Linked issues automatically appear on the /roadmap page too.

  Roadmap (/roadmap page):

    Issues and PRs appear on the roadmap in two ways:

    1. Tagged — add a "roadmap" label to any issue/PR in
       your repo. They'll appear automatically.

    2. Pinned — any issue/PR linked in content.config.tsx
       (via the issues[] arrays above) is auto-included.
       No extra config needed.

    Both sources are merged and deduplicated.

  Happy documenting! 🦴
`);
}

main().catch((err: Error) => {
  console.error(err.message);
  process.exit(1);
});
