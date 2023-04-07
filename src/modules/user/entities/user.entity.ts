import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/shared/entities';
import { EntityColumnName, EntityName } from 'src/shared/enums';
import { Column, Entity } from 'typeorm';
import { UserRole } from '../enums';

@Entity({ name: EntityName.USER })
export class UserEntity extends BaseEntity {
  @Column({ name: EntityColumnName.NAME })
  name: string;

  @Column({ name: EntityColumnName.EMAIL, unique: true })
  email: string;

  @Exclude()
  @Column({ name: EntityColumnName.PASSWORD })
  password: string;

  @Column({ name: EntityColumnName.ROLE })
  role: UserRole;
}
