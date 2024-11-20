import { ApiProperty } from '@nestjs/swagger'
import { ISettingResponse } from '../interfaces/setting.interface'
import { CreateSettingDto } from './create-setting.dto'

export * from './create-setting.dto'
export * from './update-setting.dto'

export class SwaggerCreateSettingDto extends CreateSettingDto {}

export class SwaggerSettingResponseDto implements ISettingResponse {
	@ApiProperty({ name: 'id', example: 'UUID' })
	id: string

	@ApiProperty({ name: 'name', example: 'math' })
	name: string

	@ApiProperty({ name: 'status', example: true })
	status: boolean

	@ApiProperty({ name: 'createdAt', example: '2024-11-20 15:13:33.037' })
	createdAt: Date

	@ApiProperty({ name: 'updatedAt', example: '2024-11-20 15:13:33.037' })
	updatedAt: Date
}
