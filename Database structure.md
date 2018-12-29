# Database structure

## Tables

* `boards`
* `posts`
* `pushes`

### `boards`

| Column name | Data Type | Attributes                                             | Example Value |
| ----------- | --------- | ------------------------------------------------------ | ------------- |
| `id`        | `INTEGER` | `PRIMARY KEY`<br />`AUTOINCREMENT`<br />`UNIQUE INDEX` | `1`           |
| `name`      | `TEXT`    | `UNIQUE`<br />`NOT NULL`<br />`UNIQUE INDEX`           | `Gossiping`   |

### `users`

| Column name | Data Type | Attributes                                             | Example Value |
| ----------- | --------- | ------------------------------------------------------ | ------------- |
| `id`        | `INTEGER` | `PRIMARY KEY`<br />`AUTOINCREMENT`<br />`UNIQUE INDEX` | `87`          |
| `username`  | `TEXT`    | `UNIQUE`<br />`NOT NULL`<br />`UNIQUE INDEX`           | `audi86`      |

### `posts`

| Column name | Data Type | Attributes                                             | Example Value                                              |
| ----------- | --------- | ------------------------------------------------------ | ---------------------------------------------------------- |
| `id`        | `INTEGER` | `PRIMARY KEY`<br />`AUTOINCREMENT`<br />`UNIQUE INDEX` | `123456`                                                   |
| `board`     | `INTEGER` | `FOREIGN KEY (boards.id)`<br />`NOT NULL`<br />`INDEX` | `1`                                                        |
| `post_id`   | `TEXT`    | `UNIQUE(board, post_id)`<br />`INDEX`                  | `1QQ10QRo`                                                 |
| `author`    | `INTEGER` | `FOREIGN KEY (users.id)`<br />`NOT NULL`<br />`INDEX`  | `87`                                                       |
| `date_time` | `INTEGER` | `INDEX`                                                | `1544356116`                                               |
| `title`     | `TEXT`    |                                                        | `[問卦] 在香港唸到大學是不是很屌`                          |
| `web_url`   | `TEXT`    |                                                        | `https://www.ptt.cc/bbs/Gossiping/M.1543497666.A.6EC.html` |
| `ip`        | `TEXT`    | `INDEX`                                                | `223.141.187.205`                                          |

### `posts_content`

| Column name | Data Type | Attributes                                                   | Example Value   |
| ----------- | --------- | ------------------------------------------------------------ | --------------- |
| `id`        | `INTEGER` | `PRIMARY KEY`<br />`AUTOINCREMENT`<br />`UNIQUE INDEX`       | `123456`        |
| `post`      | `INTEGER` | `FOREIGN KEY (posts.id)`<br />`UNIQUE`<br />`NOT NULL`<br />`UNIQUE INDEX` | `123456`        |
| `content`   | `TEXT`    | `NOT NULL`                                                   | `幹 內容很長啦` |

### `pushes`

| Column name | Data Type | Attributes                                             | Example Value                              |
| ----------- | --------- | ------------------------------------------------------ | ------------------------------------------ |
| `id`        | `INTEGER` | `PRIMARY KEY`<br />`AUTOINCREMENT`<br />`UNIQUE INDEX` | `8`                                        |
| `post`      | `INTEGER` | `FOREIGN KEY (posts.id)`<br />`NOT NULL`<br />`INDEX`  | `123456`                                   |
| `type`      | `TEXT`    | `NOT NULL`<br />`INDEX`                                | `2`                                        |
| `author`    | `INTEGER` | `FOREIGN KEY (users.id)`<br />`NOT NULL`<br />`INDEX`  | `12345`                                    |
| `content`   | `TEXT`    | `NOT NULL`                                             | `香港有分，只有前四大是好的，後面也是學店` |
| `ip`        | `TEXT`    | `INDEX`                                                | `None`                                     |
| `date_time` | `INTEGER` | `NOT NULL`<br />`INDEX`                                | `1544356116`                               |

### `crawled_posts`

| Column Name | Data Type | Attributes                                                   | Example Value |
| ----------- | --------- | ------------------------------------------------------------ | ------------- |
| `id`        | `INTEGER` | `PRIMARY KEY`<br />`AUTOINCREMENT`<br />`INDEX`              | `123456`      |
| `post`      | `INTEGER` | `FOREIGN KEY (posts.id)`<br />`UNIQUE`<br />`NOT NULL`<br />`INDEX` | `123456`      |
| `date_time` | `INTEGER` | `NOT NULL`<br />`INDEX`                                      | `1544356116`  |

### `crawled_page_range`

| Column Name      | Data Type | Attributes                                                   | Example Value |
| ---------------- | --------- | ------------------------------------------------------------ | ------------- |
| `id`             | `INTEGER` | `PRIMARY KEY`<br />`AUTOINCREMENT`<br />`INDEX`              | `1`           |
| `board`          | `INTEGER` | `FOREIGN KEY (board.id)`<br />`NOT NULL`<br />`INDEX`        | `Gossiping`   |
| `beginning_page` | `INTEGER` | `UNIQUE (board, beginning_page, ending_page)`<br />`NOT NULL`<br />`INDEX` | `86400`       |
| `ending_page`    | `INTEGER` | `UNIQUE (board, beginning_page, ending_page)`<br />`NOT NULL`<br />`INDEX` | `0`           |
| `date_time`      | `INTEGER` | `NOT NULL`<br />`INDEX`                                      | `1544356116`  |

