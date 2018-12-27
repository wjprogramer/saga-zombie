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

#### HTTP API

##### `get_post_word_freq`

* `post_id`

##### `get_word_freq`

* `beginning_day`

* `ending_day`

##### `get_users_pushes_count`

* `beginning_day`

* `ending_day`

##### `get_users_posts_count`

* `beginning_day`

* `ending_day`

##### `get_user_pushes_word_freq`

`username`

`beginning_day`

`ending_day`
