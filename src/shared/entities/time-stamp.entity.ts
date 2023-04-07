import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { EntityColumnName } from '../enums';

export abstract class TimeStampEntity {
  @CreateDateColumn({ name: EntityColumnName.CREATED_AT, type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: EntityColumnName.UPDATED_AT, type: 'timestamptz' })
  updatedAt: Date;
}
