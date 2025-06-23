export default {
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        releaseRules: [
          { type: 'breaking', release: 'major' },
          { type: 'refactor', release: 'patch' },
        ],
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalCommits',
        presetConfig: {
          types: [
            {
              type: 'breaking',
              section: 'Breaking Changes',
            },
            {
              type: 'feat',
              section: 'Features',
            },
            {
              type: 'fix',
              section: 'Bug Fixes',
            },
            {
              type: 'refactor',
              section: 'Internal',
              hidden: false,
            },
            {
              type: 'perf',
              section: 'Internal',
              hidden: false,
            },
          ],
        },
      },
    ],
    '@semantic-release/npm',
    '@semantic-release/changelog',
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'package-lock.json', 'CHANGELOG.md'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    '@semantic-release/github',
  ],
}
