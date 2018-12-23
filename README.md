# 分析網軍！

## Setup

### pip

```sh
pip3 install -r requirements.txt
```

### docker

```sh
docker build -t saga-zombie .
```

## 資料庫架構

[點我](./Database%20structure.md)

## Dev

### 注意！！

爬文不要用 `PTTLibrary.PTT.crawlBoard` ! 它會自爆！！！

爬文不要用 `PTTLibrary.PTT.crawlBoard` ! 它會自爆！！！

爬文不要用 `PTTLibrary.PTT.crawlBoard` ! 它會自爆！！！

### db.SQLiteDBHandler.`SQLiteDBHandler()`

已經加入 lock 防止多執行序同時寫入資料庫造成錯誤。預設每插入 10000 比資料會寫入硬碟一次。

如果指定的資料庫檔案不存在的話會新建一個，並自動創造好表格。

建議使用 with as 語句來確保離開時會自動寫入硬碟。

```
with SQLiteDBHandler('test.db') as db:
	# do something here
```

#### 查詢

##### `__init__(path)`

`path` 是 SQLite 檔案路徑

##### `query(q)`

如果請求的東西是沒有概括到的就先用這個

##### `get_boards()`

列出資料庫有包含的看板

##### `get_users()`

列出資料庫有包含的使用者

##### `get_posts(after: int=0)`

列出所有某個時間點之後的貼文（所有看板），如果沒有指定就列出全部

##### `get_pushes(after: int=0)`

列出所有推文（所有看板所有 po 文）

##### `get_board_id(board: str)`

取的看板在資料庫中所對應的 ID

##### `get_user_id(username: str)`

取得用戶名在資料庫中對應的 ID

##### `get_post(board, index: int)`

透過看板名稱和 index 取得貼文

##### `get_posts_by_user_id(user_id: int, after: int=0)`

取的某用戶的所有 po 文

##### `get_posts_by_username(username: str, after: int=0)`

同上

##### `get_posts_by_ip(ip: str)`

取得 IP 下所發表的文章

##### `get_pushes_by_user_id(user_id: int, after: int=0)`

用戶推文

##### `get_pushes_by_username(username: str, after: int=0)`

同上

##### `get_pushes_by_ip(ip: str)`

指定 IP 下的推文

#### 寫入

##### `insert_or_update_post(post: PostInformation, index: int)`

將文章新增到資料庫中，如果文章已經存在則更新資訊

##### `add_user(user: str)`

將用戶加到資料庫中

##### `add_board(board: str)`

將看板加到資料庫中

