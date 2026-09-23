<div align="center">

<br />

<img src="TTL-Website/public/images/logo.png" alt="Tinh Hoa Việt" width="560" />

<br />
<br />

<h1>SOS · Tinh Hoa Việt</h1>

<p><strong>Kết nối cộng đồng. Chia sẻ giá trị. Lưu truyền di sản.</strong></p>
<p>Nền tảng cộng đồng với hồ sơ thành viên, bài viết, học tập và quản trị.<br />Chạy website, API và database trên máy của bạn bằng Docker Compose.</p>

<p>
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&amp;logoColor=white" alt="Docker Compose" />
  <img src="https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&amp;logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/Express-4-333333?logo=express&amp;logoColor=white" alt="Express 4" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&amp;logoColor=white" alt="PostgreSQL 16" />
  <img src="https://img.shields.io/badge/Local-Windows%20%7C%20macOS%20%7C%20Linux-6750A4" alt="Local trên Windows, macOS và Linux" />
</p>

<p>
  <a href="#tong-quan">Tổng quan</a> ·
  <a href="#bat-dau">Bắt đầu</a> ·
  <a href="#cau-hinh">Cấu hình</a> ·
  <a href="#su-dung">Lệnh thường dùng</a> ·
  <a href="#kien-truc">Kiến trúc</a> ·
  <a href="#go-loi">Gỡ lỗi</a>
</p>

<br />

</div>

---

**Đã có `.env.docker`?** Mở terminal tại thư mục `SOS` và chạy:

```bash
docker compose --env-file .env.docker -f docker-compose.yml -f docker-compose.local.yml up -d --build --wait
```

**Mở [localhost:3000](http://localhost:3000)** khi các dịch vụ báo `Healthy`. Nếu mới tải dự án, làm theo các bước bên dưới trước.

<a id="tong-quan"></a>

## Một nơi cho cộng đồng và tri thức

| Cộng đồng | Học tập & hoạt động | Quản trị |
| --- | --- | --- |
| Hồ sơ thành viên, bài viết, bình luận và thông báo. | Bài học, nhật ký và các luồng đăng ký thành viên. | Quản lý người dùng, nội dung, hồ sơ và lịch sử hoạt động. |

Docker đóng gói môi trường chạy của dự án: bạn không cần cài Node.js, npm hay PostgreSQL trực tiếp trên máy. Lần đầu cần Internet để tải image, dependencies và tài nguyên phục vụ build.

<a id="bat-dau"></a>

## Bắt đầu trong 3 bước

### 01 · Chuẩn bị

- Cài và mở **Docker Desktop** trên Windows/macOS; trên Linux dùng Docker Engine kèm Compose v2.
- Trên Windows, dùng chế độ **Linux containers** của Docker Desktop.
- Chuẩn bị mã nguồn SOS và để trống cổng **3000**, **4000**.

Nếu chưa có mã nguồn:

```bash
git clone https://github.com/tboi0602/SOS.git
cd SOS
```

Nếu đã có, mở terminal ngay trong thư mục chứa `docker-compose.yml`. Kiểm tra Docker:

```bash
docker info
docker compose version
```

### 02 · Tạo cấu hình lần đầu

Sao chép file mẫu **nếu chưa có `.env.docker`**. Giữ nguyên file đã được cấu hình trước đó.

**Windows — PowerShell:**

```powershell
Copy-Item .env.example .env.docker
```

**macOS / Linux:**

```bash
cp .env.example .env.docker
```

Mở `.env.docker` bằng trình soạn thảo và cập nhật các giá trị sau:

```dotenv
DOCKER_USER=sos-local
IMAGE_TAG=latest

POSTGRES_USER=postgres
POSTGRES_PASSWORD=REPLACE_WITH_RANDOM_HEX_PASSWORD
POSTGRES_DB=ttl
DATABASE_URL=postgresql://postgres:REPLACE_WITH_RANDOM_HEX_PASSWORD@postgres:5432/ttl
JWT_SECRET=REPLACE_WITH_ANOTHER_RANDOM_SECRET

PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Thay các giá trị `REPLACE_WITH_...` trước khi chạy. Dùng chuỗi ngẫu nhiên dài, chỉ gồm chữ và số cho mật khẩu database để dễ đưa vào URL; mật khẩu trong `DATABASE_URL` phải khớp `POSTGRES_PASSWORD`. Dùng một chuỗi riêng cho `JWT_SECRET`.

`sos-local` chỉ là tên image trên máy, không yêu cầu tài khoản Docker Hub. Các lệnh trong README dùng `.env.docker` cho cả Compose và container; không cần tạo `.env` trong hai thư mục ứng dụng khi chạy theo cách này.

> Backend hiện yêu cầu `RESEND_API_KEY` và `GOOGLE_CLIENT_ID` không được để trống. Có thể giữ giá trị mẫu để khởi động thử giao diện và API, nhưng email và Google login chỉ hoạt động khi điền thông tin thật. Xem [cấu hình dịch vụ](#cau-hinh) trước khi thử đăng ký hoặc đăng nhập bằng Google.

### 03 · Khởi động

Chạy tại thư mục `SOS`:

```bash
docker compose --env-file .env.docker -f docker-compose.yml -f docker-compose.local.yml up -d --build --wait
```

Docker sẽ build hai ứng dụng, khởi động PostgreSQL, đồng bộ schema bằng Prisma rồi chạy API và website. `--wait` chờ các dịch vụ sẵn sàng; `-d` giữ chúng chạy nền sau khi lệnh kết thúc. Lần build đầu có thể mất vài phút hoặc lâu hơn tùy mạng và máy.

| Truy cập | Địa chỉ | Kết quả mong đợi |
| --- | --- | --- |
| Website | [localhost:3000](http://localhost:3000) | Trang chủ Tinh Hoa Việt |
| API health | [localhost:4000/api/health](http://localhost:4000/api/health) | `status: "ok"`, `database: "connected"` |

Không cần chạy thêm `npm install`, Prisma hoặc tạo database thủ công. Cấu hình local chỉ mở website và API trên máy của bạn; PostgreSQL nằm trong mạng Docker.

<a id="cau-hinh"></a>

## Kết nối các dịch vụ

Chỉnh các biến dưới đây trong **`.env.docker`** khi cần sử dụng tính năng tương ứng.

| Tính năng | Biến môi trường | Cần điền |
| --- | --- | --- |
| Email kích hoạt / đặt lại mật khẩu | `RESEND_API_KEY`, `EMAIL_FROM` | API key Resend thật và địa chỉ gửi được tài khoản cho phép sử dụng. |
| Đăng nhập Google | `GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Cùng một Google OAuth client ID; cấu hình origin `http://localhost:3000` tại nhà cung cấp. |
| Trợ lý AI | `GEMINI_API_KEY` | API key Gemini thật; để trống nếu chưa dùng. |
| TBV SSO | `TBV_OIDC_ISSUER`, `TBV_OIDC_CLIENT_ID`, `TBV_OIDC_CLIENT_SECRET`, `TBV_OIDC_REDIRECT_URI` | Thông tin từ nhà cung cấp SSO; callback local là `http://localhost:4000/api/v1/auth/oidc/callback`. |

Nếu chưa dùng TBV SSO, để trống issuer, client ID và client secret. Không cần cấu hình domain, SSH hoặc VPS để chạy local.

Sau khi đổi cấu hình, chạy lại lệnh khởi động có `--build`. Các biến `NEXT_PUBLIC_*` được đưa vào website lúc build, nên chỉ `restart` sẽ không cập nhật được chúng.

`.env.docker` đã được Git bỏ qua. Không đưa khóa thật vào README hoặc file mẫu được commit.

<a id="su-dung"></a>

## Những lệnh bạn sẽ dùng

Tất cả lệnh dưới đây chạy từ thư mục `SOS`.

**Mở lại dự án đã build, không thay đổi mã nguồn hay cấu hình:**

```bash
docker compose --env-file .env.docker -f docker-compose.yml -f docker-compose.local.yml up -d --wait
```

**Xem trạng thái:**

```bash
docker compose --env-file .env.docker -f docker-compose.yml -f docker-compose.local.yml ps
```

**Theo dõi log:**

```bash
docker compose --env-file .env.docker -f docker-compose.yml -f docker-compose.local.yml logs -f --tail=100
```

Nhấn `Ctrl+C` để thoát xem log; các container vẫn chạy nền.

**Dừng dự án:**

```bash
docker compose --env-file .env.docker -f docker-compose.yml -f docker-compose.local.yml down
```

Lệnh `down` trên giữ dữ liệu PostgreSQL trong `data/postgres` và file tải lên trong volume `uploads_data`. Không thêm `-v` nếu muốn giữ volume chứa file tải lên.

<a id="kien-truc"></a>

## Ba dịch vụ, một lệnh chạy

```mermaid
flowchart LR
    U[Trình duyệt] -->|localhost:3000| W[Website · Next.js]
    U -->|localhost:4000| A[API · Express]
    A -->|postgres:5432| D[(PostgreSQL)]
    A --> F[Volume · uploads_data]
```

| Thành phần | Vai trò |
| --- | --- |
| `TTL-Website/` | Giao diện Next.js; được build thành ứng dụng standalone. |
| `TTL-Server/` | API Express, Prisma và các tích hợp email, AI, xác thực. |
| `docker-compose.yml` | Định nghĩa dịch vụ, network và nơi lưu dữ liệu. |
| `docker-compose.local.yml` | Mở cổng local và đồng bộ schema trước khi khởi động API. |
| `.env.example` | Mẫu biến môi trường cho người mới. |
| `.env.docker` | Cấu hình riêng trên máy của bạn. |

`docker-compose.dev.yml` dành cho cách chạy backend bằng Node.js trên máy. Hướng dẫn này dùng `docker-compose.local.yml` để chạy **toàn bộ bằng Docker**. Nginx, SSL và các dịch vụ thuộc profile `prod` không được khởi động bởi các lệnh trên.

<a id="go-loi"></a>

## Cần trợ giúp?

<details>
<summary><strong>Docker báo không kết nối được daemon / docker_engine</strong></summary>

Mở Docker Desktop và chờ engine sẵn sàng. Chạy `docker info` để kiểm tra rồi chạy lại lệnh khởi động. Trên Windows, xác nhận đang dùng Linux containers.

</details>

<details>
<summary><strong>Thiếu .env.docker hoặc biến môi trường</strong></summary>

Đảm bảo terminal đang ở thư mục `SOS`, đã sao chép `.env.example` thành `.env.docker` và điền các giá trị ở bước 02. Kiểm tra cú pháp Compose:

```bash
docker compose --env-file .env.docker -f docker-compose.yml -f docker-compose.local.yml config --quiet
```

Lệnh này kiểm tra cấu hình Compose, chưa xác nhận API key của dịch vụ bên ngoài có hợp lệ hay không.

</details>

<details>
<summary><strong>Cổng 3000 hoặc 4000 đang được sử dụng</strong></summary>

Dừng phiên `npm run dev` hoặc container khác đang dùng cổng đó, rồi chạy lại. Giữ các cổng mặc định để URL frontend, API, CORS và cấu hình đăng nhập khớp nhau.

</details>

<details>
<summary><strong>Website mở được nhưng API hoặc database chưa sẵn sàng</strong></summary>

Kiểm tra `ps` và xem log riêng hai dịch vụ:

```bash
docker compose --env-file .env.docker -f docker-compose.yml -f docker-compose.local.yml logs --tail=100 postgres server
```

Trong container, database có hostname `postgres`, không phải `localhost`. Nếu đã có dữ liệu PostgreSQL từ lần chạy trước, đổi `POSTGRES_PASSWORD` trong file env không tự đổi mật khẩu của database đã khởi tạo; dùng lại cấu hình khớp database đó. Không xóa `data/postgres` để thử sửa lỗi khi cần giữ dữ liệu.

</details>

<details>
<summary><strong>Không gửi được email, đăng nhập Google hoặc dùng AI</strong></summary>

Giá trị mẫu chỉ giúp chuẩn bị cấu hình, không thay thế thông tin tài khoản dịch vụ. Điền khóa thật theo [bảng cấu hình](#cau-hinh), kiểm tra các URL local rồi chạy lại lệnh có `--build`. Luồng đăng ký có email kích hoạt cần Resend hoạt động để hoàn tất.

</details>

<details>
<summary><strong>Build lần đầu chậm hoặc lỗi tải dependencies</strong></summary>

Lần đầu Docker phải tải image, các gói npm và build website. Kiểm tra Internet và log lỗi; khi kết nối ổn định, chạy lại lệnh có `--build`. Docker sẽ tận dụng các lớp build đã hoàn tất. Khi sửa mã nguồn cũng cần build lại vì cấu hình này không bật hot reload.

</details>

---

<div align="center">
  <p><strong>SOS · Tinh Hoa Việt</strong><br />Môi trường local của bạn, sẵn sàng cùng Docker.</p>
  <p><a href="#bat-dau">Bắt đầu chạy dự án</a> · <a href="http://localhost:3000">Mở website local</a></p>
</div>
