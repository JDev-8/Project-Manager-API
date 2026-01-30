import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {}

  async createLog(
    user: User,
    action: string,
    entityType: string,
    entityId: string,
    details?: any,
  ) {
    const log = this.auditRepository.create({
      user,
      action,
      entityType,
      entityId,
      details,
    });

    return this.auditRepository.save(log);
  }

  findAll() {
    return this.auditRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }
}
