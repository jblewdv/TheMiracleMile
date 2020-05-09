module.exports = {
  apps : [{
    name: "themiraclemile",
    script: "node ./bin/www",
    watch: '.',
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}