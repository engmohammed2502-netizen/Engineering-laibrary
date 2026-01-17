module.exports = {
  apps: [{
    name: 'engineering-library-backend',
    script: './server/server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      MONGODB_URI: 'mongodb://localhost:27017/engineering_library',
      JWT_SECRET: 'engineering_library_red_sea_university_2024_secret_key',
      UPLOAD_PATH: './uploads',
      MAX_FILE_SIZE: 157286400,
      MAX_IMAGE_SIZE: 3145728,
      FRONTEND_URL: 'http://localhost',
      BACKUP_PATH: '/var/backups/engineering-library',
      BACKUP_RETENTION_DAYS: 30,
      LOGIN_ATTEMPTS_LIMIT: 5,
      ACCOUNT_LOCK_TIME: 24
    },
    error_file: './logs/backend-error.log',
    out_file: './logs/backend-out.log',
    log_file: './logs/backend-combined.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    
    // إعادة التشغيل عند استهلاك ذاكرة عالية
    max_memory_restart: '500M',
    
    // مراقبة وتصحيح الأخطاء
    min_uptime: '60s',
    max_restarts: 10,
    
    // تتبع الأداء
    vizion: false,
    increment_var: 'PORT'
  }]
};
