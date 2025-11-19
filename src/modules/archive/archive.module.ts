import { forwardRef, Module } from '@nestjs/common'
import { ArchiveController } from './archive.controller'
import { ArchiveService } from './archive.service'
import { ArchiveRepository } from './archive.repository'
import { PrismaModule } from '../prisma'
import { UserModule } from '../user'
import { CollectionModule } from '../collection'
import { UserCollectionModule } from '../user-collection'

@Module({
	imports: [PrismaModule, UserModule, CollectionModule, forwardRef(() => UserCollectionModule)],
	controllers: [ArchiveController],
	providers: [ArchiveService, ArchiveRepository],
	exports: [ArchiveRepository],
})
export class ArchiveModule {}
