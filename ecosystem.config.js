module.exports = {
  apps: [
    {
      name: "lemonsalt",
      script: "npm",
      args: "start",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        PORT: 3010,
        NEXT_PUBLIC_SITE_URL: "https://lemonsalt.digiwaytec.com",
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
    },
  ],
};
