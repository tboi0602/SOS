#local
sửa lại .env để deploy
bash scripts/deploy.sh .env.docker

#vps
docker compose pull
docker compose up -d

Lệnh
docker image prune -a -f	Xoá image không dùng đến
docker container prune -f	Xoá container đã dừng
docker volume prune -f	Xoá volume không container nào gắn
docker builder prune -a -f	Xoá cache build



2. Dọn toàn bộ rác Docker (image cũ, container stopped, volume ko dùng, cache build):
docker system prune -a --volumes -fo

3. Truy cập db trực tiếp 
docker compose exec -it postgres psql -U postgres -d ttl