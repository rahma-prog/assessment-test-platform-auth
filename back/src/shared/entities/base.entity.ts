import { PrimaryGeneratedColumn } from 'typeorm';
import { EntityColumnName } from '../enums';
import { TimeStampEntity } from './time-stamp.entity';

export abstract class BaseEntity extends TimeStampEntity {
  @PrimaryGeneratedColumn('increment', {
    name: EntityColumnName.ID,
    type: 'bigint',
  })
  id: string;
}
