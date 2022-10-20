import { Pool } from 'src/database/pool/pool.entity';
import { Status } from 'src/database/status/status.entity';
import { Task } from 'src/database/task/task.entity';
import { Todolist } from 'src/database/todolist/todolist.entity';
import { User } from 'src/database/user/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5436,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'postgres',
  schema: process.env.DATABASE_SCHEMA || 'public',
  entities: [Task, User, Todolist, Pool, Status],
  migrations: ['src/migrations/1666328125440-AddStatus.ts'],
};

const postgresDataSource = new DataSource(config);
export default postgresDataSource;
