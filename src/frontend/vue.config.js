module.exports = {
    configureWebpack: {
        devtool: 'source-map',
        devServer: {
            proxy: {
                '/api': {
                    target: 'https://localhost:5001/',
                    secure: false,
                    ws: true,
                }
            }
        }
    }
};
