import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AuditableEntity } from './Audit.entity';
import { Role } from './Role.entity';


@Entity()
export class User extends AuditableEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: true })
  avatar: string;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn()
  role: Role;
}
