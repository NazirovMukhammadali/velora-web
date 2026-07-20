/** @type {import('jest').Config} */
module.exports = {
	testEnvironment: 'node',
	roots: ['<rootDir>/__tests__'],
	testMatch: ['**/*.test.ts'],
	modulePathIgnorePatterns: ['<rootDir>/.next/'],
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				tsconfig: '<rootDir>/tsconfig.jest.json',
				diagnostics: false,
			},
		],
	},
};
