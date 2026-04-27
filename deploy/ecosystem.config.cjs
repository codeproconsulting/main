module.exports = {
  apps: [
    {
      name: "proconsulting-main",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
}
