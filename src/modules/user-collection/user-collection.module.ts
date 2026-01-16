import { forwardRef, Module } from '@nestjs/common'
import { UserCollectionController } from './user-collection.controller'
import { UserCollectionService } from './user-collection.service'
import { UserCollectionRepository } from './user-collection.repository'
import { PrismaModule } from '../prisma'
import { ArchiveModule } from 'modules/archive'
import { UserInfoModule } from 'modules/user-info'

@Module({
	imports: [PrismaModule, UserInfoModule, forwardRef(() => ArchiveModule)],
	controllers: [UserCollectionController],
	providers: [UserCollectionService, UserCollectionRepository],
	exports: [UserCollectionRepository, UserCollectionService],
})
export class UserCollectionModule {}
