import { Module } from '@nestjs/common'
import { SettingService } from './setting.service'
import { SettingController } from './setting.controller'
import { PrismaModule } from 'modules/prisma'
import { SettingRepository } from './setting.repository'

@Module({
	imports: [PrismaModule],
	controllers: [SettingController],
	providers: [SettingService, SettingRepository],
})
export class SettingModule {}
