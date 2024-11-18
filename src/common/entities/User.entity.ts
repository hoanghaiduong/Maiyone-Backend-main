import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { AuditableEntity } from './Audit.entity';
import { Role } from './Role.entity';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
@Entity()
export class User extends AuditableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  @Exclude()
  password: string;

  @Column({ unique: true, nullable: true })
  phoneNumber: string;
  
  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: false, default: false })
  isLocked: boolean;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn()
  role: Role;

  @BeforeInsert()
  // @BeforeUpdate()
  async hashPassword() {
    // Check if the password field has been modified before hashing
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
