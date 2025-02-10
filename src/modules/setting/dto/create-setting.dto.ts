import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ICreateSetting } from '../interfaces/setting.interface'

export class CreateSettingDto implements ICreateSetting {
	@ApiProperty({ example: 'name' })
	@IsNotEmpty()
	@IsString()
	name: string

	@ApiProperty({ example: true })
	@IsOptional()
	@IsBoolean()
	status: boolean
}
