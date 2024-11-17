import { Module } from '@nestjs/common';
import { DirectoryService } from './directory.service';
import { DirectoryController } from './directory.controller';
import { PrismaModule } from 'modules/prisma';
import { DirectoryRepository } from './directory.repository';

@Module({
	imports: [PrismaModule],
	controllers: [DirectoryController],
	providers: [DirectoryService, DirectoryRepository],
})
export class DirectoryModule {}
