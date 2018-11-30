# Database structure

## Tables

* `boards`
* `posts`
* `pushes`

### `boards`

| Column name | Data Type | Attributes                         | Example Value |
| ----------- | --------- | ---------------------------------- | ------------- |
| `id`        | `INTEGER` | `PRIMARY KEY`<br />`AUTOINCREMENT` |               |
| `name`      | `TEXT`    | `UNIQUE`<br />`NOT NULL`           | `Gossiping`   |

### `users`

| Column name | Data Type | Attributes                         | Example Value |
| ----------- | --------- | ---------------------------------- | ------------- |
| `id`        | `INTEGER` | `PRIMARY KEY`<br />`AUTOINCREMENT` |               |
| `username`  | `TEXT`    | `UNIQUE`<br />`NOT NULL`           | `audi86`      |

### `posts`

| Column name    | Data Type | Attributes                                | Example Value                                              |
| -------------- | --------- | ----------------------------------------- | ---------------------------------------------------------- |
| `id`           | `INTEGER` | `PRIMARY KEY`<br />`AUTOINCREMENT`        |                                                            |
| `board`        | `INTEGER` | `FOREIGN KEY (boards.id)`<br />`NOT NULL` | `Gossiping`                                                |
| `index`        | `INTEGER` | `NOT NULL`                                | `70000`                                                    |
| `post_id`      | `TEXT`    | `UNIQUE`                                  | `1QQ10QRo`                                                 |
| `author`       | `INTEGER` | `FOREIGN KEY (users.id)`<br />`NOT NULL`  | `audi86`                                                   |
| `date_time`    | `INTEGER` |                                           | `Wed Jan 24 12:48:24 2018`<br />(Unix Time)                |
| `title`        | `TEXT`    |                                           | `[問卦] 在香港唸到大學是不是很屌`                          |
| `web_url`      | `TEXT`    |                                           | `https://www.ptt.cc/bbs/Gossiping/M.1543497666.A.6EC.html` |
| `money`        | `INTEGER` |                                           | `1`                                                        |
| `ip`           | `TEXT`    |                                           | `223.141.187.205`                                          |
| `delete_state` | `INTEGER` | `NOT NULL`                                | `0`                                                        |
| `list_date`    | `TEXT`    | `NOT NULL`                                | `1/24`                                                     |

### `post_content`

| Column name | Data Type | Attributes                                             | Example Value |
| ----------- | --------- | ------------------------------------------------------ | ------------- |
| `id`        | `INTEGER` | `PRIMARY KEY`<br />`AUTOINCREMENT`                     |               |
| `post`      | `INTEGER` | `FOREIGN KEY (posts.id)`<br />`UNIQUE`<br />`NOT NULL` |               |
| `content`   | `TEXT`    | `NOT NULL`                                             |               |

### `pushs`

| Column name | Data Type | Attributes                               | Example Value                              |
| ----------- | --------- | ---------------------------------------- | ------------------------------------------ |
| `id`        | `INTEGER` | `PRIMARY KEY`<br />`AUTOINCREMENT`       |                                            |
| `post`      | `INTEGER` | `FOREIGN KEY (posts.id)`<br />`NOT NULL` | `[問卦] 在香港唸到大學是不是很屌`          |
| `type`      | `INTEGER` | `NOT NULL`                               | `2`                                        |
| `author`    | `INTEGER` | `FOREIGN KEY (users.id)`<br />`NOT NULL` | `jack168168tw`                             |
| `content`   | `TEXT`    | `NOT NULL`                               | `香港有分，只有前四大是好的，後面也是學店` |
| `ip`        | `TEXT`    |                                          | `None`                                     |
| `date_time` | `INTEGER` | `NOT NULL`                               | `01/24 12:49`<br />(Unix Time)             |

### `crawled_posts`

| Column Name | Data Type | Attributes                                             | Example Value |
| ----------- | --------- | ------------------------------------------------------ | ------------- |
| `id`        | `INTEGER` | `PRIMARY KEY`<br />`AUTOINCREMENT`                     |               |
| `post`      | `INTEGER` | `FOREIGN KEY (posts.id)`<br />`UNIQUE`<br />`NOT NULL` |               |
| `date_time` | `INTEGER` | `NOT NULL`                                             |               |

