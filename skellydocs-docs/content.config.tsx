import type { SkellyDocsConfig } from '@freemocap/skellydocs';
import { Tip } from '@freemocap/skellydocs';

const config: SkellyDocsConfig = {
  hero: {
    title: 'skellydocs',
    accentedSuffix: 'docs',
    subtitle: 'Part of the FreeMoCap ecosystem',
    tagline: 'Shared Docusaurus theme and toolkit for FreeMoCap documentation sites',
    logoSrc: '/skellydocs/img/logo.svg',
    parentProject: {
      name: 'FreeMoCap',
      url: 'https://freemocap.org',
    },
  },

  features: [
    {
      id: 'shared-theme',
      icon: '🎨',
      title: 'Shared Theme',
      description: 'One theme for all FreeMoCap docs sites — consistent dark-mode design with CSS design tokens.',
      summary: (
        <>
          A unified dark-mode theme using{' '}
          <Tip text="CSS custom properties prefixed with --sk-* that control colors, fonts, and spacing across all components">
            CSS design tokens
          </Tip>{' '}
          so every FreeMoCap project looks and feels the same.
        </>
      ),
      todos: [],
      docPath: 'guides/customizing-styles',
    },
    {
      id: 'ready-components',
      icon: '🧩',
      title: 'Ready-Made Components',
      description: 'IndexPage, RoadmapPage, Tip, TodoList, and more — just import and use.',
      summary: (
        <>
          Drop-in React components for{' '}
          <Tip text="IndexPage renders hero + features + guarantees; RoadmapPage fetches GitHub issues automatically">
            landing pages, roadmaps, and interactive docs
          </Tip>
          . Your pages are just thin wrappers.
        </>
      ),
      todos: [],
      docPath: 'guides/using-components',
    },
    {
      id: 'cli-scaffolder',
      icon: '⚡',
      title: 'CLI Scaffolder',
      description: 'npx @freemocap/skellydocs init — bootstrap a new docs site in seconds.',
      summary: (
        <>
          Run{' '}
          <Tip text="Interactive prompts for project name, repo, and base URL — generates all config files">
            one command
          </Tip>{' '}
          to scaffold a fully configured docs site with all the wiring done.
        </>
      ),
      todos: [],
      docPath: 'guides/project-setup',
    },
  ],

  guarantees: [
    'Every FreeMoCap docs site shares <strong>identical styling and components</strong>',
    'Your docs repo contains <strong>only content</strong> — no duplicated theme code',
    'One package update upgrades <strong>all sites at once</strong>',
  ],

  guaranteeTodos: [],
};

export default config;
