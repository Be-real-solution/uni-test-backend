import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'
import { ICreateDirectory } from '../interfaces'

export class CreateDirectoryDto implements ICreateDirectory {
	@ApiPropertyOptional({ example: 'math' })
	@IsNotEmpty()
	@IsString()
	name: string

	@ApiPropertyOptional({ example: 'uuid' })
	@IsUUID('4')
	@IsOptional()
	parentId?: string
}
