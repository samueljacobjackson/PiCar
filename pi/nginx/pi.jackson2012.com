upstream websocket {
    server localhost:1880;
}

server {
    listen 80;
    listen 443 ssl http2;

    server_name pi.jackson2012.com;

    ssl_certificate /etc/letsencrypt/live/pi.jackson2012.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pi.jackson2012.com/privkey.pem;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
    ssl_prefer_server_ciphers On;
    ssl_session_cache shared:SSL:128m;
    ssl_stapling on;
    ssl_stapling_verify on;

    resolver 8.8.8.8;

    location / {
        if ($scheme = http) {
            return 301 https://$server_name$request_uri;
        }
        proxy_pass http://localhost:1880/picar;
    }

    location /picar {
        if ($scheme = http) {
            return 301 https://$server_name$request_uri;
        }
        proxy_pass http://localhost:1880;
    }

    location /node-red {
	if ($scheme = http) {
            return 301 https://$server_name$request_uri;
        }
        proxy_pass http://localhost:1880;
    }

    location /fonts {
        if ($scheme = http) {
            return 301 https://$server_name$request_uri;
        }
        proxy_pass http://localhost:1880;
    }

    location /resource {
	if ($scheme = http) {
            return 301 https://$server_name$request_uri;
        }
        rewrite ^/resource(.*)$ /$1 break;
        proxy_pass http://localhost:1880;
    }

    location /vid {
        proxy_pass http://localhost:8081/?action=stream;
    }

    #picar websockets
    location /ws/picar {
        proxy_pass http://localhost:1880;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 300s;
    }

    #node-red websockets
    location /node-red/comms {
        proxy_pass http://localhost:1880;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 300s;
    }

    location '/.well-known/acme-challenge' {
        root /var/www/html;
    }
}
