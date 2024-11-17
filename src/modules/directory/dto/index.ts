import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IFindOneDirectoryResponse } from '../interfaces'
import { Type } from 'class-transformer'

export * from './create-directory.dto'

export class SwaggerDirectoryDto implements IFindOneDirectoryResponse {
	@ApiProperty({ name: 'id', example: 'ff084d2b-9e4e-468f-8e24-8688263a3c11', description: 'UUID' })
	id: string
	@ApiProperty({ name: 'name', example: 'math' })
	name: string

	@ApiProperty({ name: 'parentId', example: '86cebc8a-47c1-450e-85f9-f6b2b2dfd579' })
	parentId: string

	@ApiPropertyOptional({ name: 'parent', example: { SwaggerDirectoryDto } })
	parent?: SwaggerDirectoryDto

	@ApiPropertyOptional({ name: 'children', example: [] })
	children?: SwaggerDirectoryDto[]

	@ApiProperty({ name: 'createdAt', example: `${new Date()}` })
	createdAt: Date
}
