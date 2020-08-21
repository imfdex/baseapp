const alias = require('../webpack/alias');

module.exports = {
    rootDir: '../',
    setupFilesAfterEnv: ['jest-enzyme', '<rootDir>/jest/setup.tsx'],
    testEnvironment: 'enzyme',
    verbose: false,
    moduleNameMapper: {
        ...alias.jest,
        '^.+\\.(css|less|scss)$': 'identity-obj-proxy',
        '^react-scroll-to-component$': 'identity-obj-proxy',
    },
    globals: {
        __webpack_hash__: '1',
    },
    // ---------------------------------------------------------------------------
    roots: ['<rootDir>'],
    transform: {
        '^.+\\.(tsx|ts)$': 'ts-jest',
        '^.+\\.(jsx|js)$': 'babel-jest',
        '^.+\\.svg$': '<rootDir>/jest/svg-transform.js',
    },
    testRegex: '.src/units/.*.(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx|jsx)?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'css', 'scss'],
    snapshotSerializers: ['enzyme-to-json/serializer'],
    transformIgnorePatterns: ['<rootDir>/node_modules/(?!lodash-es)'],
    testURL: 'http://localhost',
    collectCoverageFrom: ['<rootDir>/src/units/**/*.{ts,tsx,js,jsx}'],
    coveragePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/src/charting_library/**'],
};

// moduleNameMapper: {
//     '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
//         '<rootDir>/__mocks__/fileMock.js',
//     '\\.(css|scss|pcss)$': '<rootDir>/__mocks__/styleMock.js',
// },
