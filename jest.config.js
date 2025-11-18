export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  //   reporters: [
  //     'default',
  //     [
  //       'jest-html-reporters',
  //       { publicPath: './reports', filename: 'report.html' },
  //     ],
  //     ['jest-screenshot-reporter', { dir: './screenshots' }],
  //   ],
  // npm install --save-dev jest-html-reporters jest-screenshot-reporter
};
