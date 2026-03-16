import type {SkellyDocsConfig} from '@freemocap/skellydocs';

const config: SkellyDocsConfig = {
    hero: {
        title: 'skellydocs',
        accentedSuffix: 'skellydocs',
        subtitle: 'Part of the FreeMoCap ecosystem',
        tagline: 'Add your project tagline here',
        logoSrc: '/img/logo.svg',
        parentProject: {
            name: 'FreeMoCap',
            url: 'https://freemocap.org',
        },
    },

    features: [
        {
            id: 'example-feature',
            icon: '🚀',
            title: 'Example Feature',
            description: 'Describe what this feature does.',
            summary: <>Describe what this feature does in a sentence or two.</>,
            issues: [
                {label: 'Demo Issue w/o roadmap', url: 'https://github.com/freemocap/skellydocs/issues/2'},
            ],
            docPath: 'intro',
        },
    ],

    guarantees: [
        'Add your project guarantees here',
    ],

    guaranteeIssues: [],
};

export default config;
