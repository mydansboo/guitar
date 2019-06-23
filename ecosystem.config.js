// pm2 start
// https://pm2.io/doc/en/runtime/guide/ecosystem-file
// https://pm2.io/doc/en/runtime/reference/ecosystem-file

module.exports = {
  apps: [{
    name: 'guitar777',
    script: 'node_modules/@angular/cli/bin/ng',
    args: 'serve --host 0.0.0.0 --disable-host-check',
    // cwd: '',
    max_restarts: 5,
    min_uptime: 5000,
    exec_mode: 'fork',
    instances: 1, // default
    autorestart: true, // default
    watch: false, // default
    max_memory_restart: '1G', // default
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
  deploy: {
    production: {
      user: 'node',
      host: '212.83.163.1',
      ref: 'origin/master',
      repo: 'git@github.com:repo.git',
      path: '/var/www/production',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
}
