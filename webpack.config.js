module.exports = {
    // モード値を production に設定すると最適化された状態で、
    // development に設定するとソースマップ有効でJSファイルが出力される
    mode: 'production',

    // メインとなるJavaScriptファイル（エントリーポイント）
    entry: {
        main: './assets/js/main.ts',
        sample: './assets/js/sample.ts'
    },
    output: {
        filename: "js/[name].js"
    },
    module: {
        rules: [{
            // 拡張子 .ts の場合
            test: /\.ts$/,
            // TypeScript をコンパイルする
            use: 'ts-loader'
        }]
    },
    // import 文で .ts ファイルを解決するため
    resolve: {
        extensions: [
            '.ts'
        ],
        alias: {
            vue: 'vue/dist/vue.js'
        }
    }
};