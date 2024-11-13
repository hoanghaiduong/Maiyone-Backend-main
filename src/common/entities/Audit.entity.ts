import { Entity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class AuditableEntity {
    @CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
