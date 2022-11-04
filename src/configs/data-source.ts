import { Attachment } from 'src/database/attachment/index.entity';
import { Comment } from 'src/database/comment/index.entity';
import { Favorite } from 'src/database/favorite/index.entity';
import { Pool } from 'src/database/pool/index.entity';
import { Status } from 'src/database/status/index.entity';
import { Task } from 'src/database/task/index.entity';
import { Todolist } from 'src/database/todolist/index.entity';
import { User } from 'src/database/user/index.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5436,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'postgres',
  schema: process.env.DATABASE_SCHEMA || 'public',
  entities: [Attachment, Comment, Favorite, Pool, Status, Task, Todolist, User],
  migrations: ['src/migrations/*'],
};

const postgresDataSource = new DataSource(config);
export default postgresDataSource;
