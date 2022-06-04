const {config} = require('@dhis2/cli-style')

module.exports = {
    extends: [
        config.eslintReact,
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react-hooks/recommended",
    ],
    settings: {
        "import/resolver": {
            node: {
                extensions: [".js", ".jsx", ".ts", ".tsx"],
            },
        },
    },
    globals: {
        JSX: true,
    },
    rules: {
        "no-console": "error",
        "import/order": "off",
        "import/extensions": "off",
        "react-hooks/exhaustive-deps": [
            "warn",
            {
                additionalHooks: "(useRecoilCallback|useRecoilTransaction_UNSTABLE)",
            },
        ],
    },
    parser: "@typescript-eslint/parser",
}
