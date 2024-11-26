import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
	IUserResultFindAll,
	IUserResultFindAllResponse,
	IUserResultResponse,
} from '../interfaces/user-result.interfaces'
import { UserFindOneResponse } from 'modules/user/interfaces'
import { CollectionFindOneResponse } from 'modules/collection'
import { QuestionFindOneResponse } from 'modules/question'
import { GroupFindOneResponse } from 'modules/group'
import {
	IsBoolean,
	IsBooleanString,
	IsNotEmpty,
	IsNumber,
	IsNumberString,
	IsOptional,
	IsString,
	IsUUID,
} from 'class-validator'

export class CreateUserResultDto {
	@ApiPropertyOptional({ example: 'UUID' })
	@IsOptional()
	@IsUUID('4')
	questionId: string

	@ApiPropertyOptional({ example: 'UUID' })
	@IsNotEmpty()
	@IsUUID('4')
	userId: string

	@ApiPropertyOptional({ example: false })
	@IsNotEmpty()
	@IsBoolean()
	hasFinished: boolean

	@ApiPropertyOptional({ example: 2 })
	@IsNotEmpty()
	@IsNumber()
	number: number
}

export class UserResultResponseDto implements IUserResultResponse {
	@ApiProperty({ example: 'UUID' })
  id: string
  
	@ApiProperty({ example: 'computer name' })
  compyuterName: string
  
	@ApiProperty({ example: 'ALI Akmalov' })
	userFullName: string

	@ApiProperty({ example: 4 })
	grade: number

	@ApiProperty({ example: 10 })
	questionFindCount: number

	@ApiProperty({ example: 30 })
	questionCount: number

	@ApiProperty({ example: true })
	hasFinished: boolean

	@ApiProperty({ example: '' })
	createdAt: Date

	@ApiPropertyOptional({ example: {} })
  user?: UserFindOneResponse
  
	@ApiPropertyOptional({ example: {} })
  collection?: CollectionFindOneResponse
  
	@ApiPropertyOptional({ example: {} })
  question?: QuestionFindOneResponse
  
	@ApiPropertyOptional({ example: {} })
	group?: GroupFindOneResponse
}

export class UserResultFindAllResponseDto implements IUserResultFindAllResponse {
	@ApiProperty({ example: 10 })
	totalCount: number

	@ApiProperty({ example: 1 })
	pageCount: number

	@ApiProperty({ example: 10 })
	pageSize: number

	@ApiProperty({ type: UserResultResponseDto, isArray: true })
	data: UserResultResponseDto[]
}

export class UserResultFindAllDto implements IUserResultFindAll {
	@ApiPropertyOptional({ example: 5 })
	@IsOptional()
	@IsNumberString()
	pageNumber?: number

	@ApiPropertyOptional({ example: 5 })
	@IsOptional()
	@IsNumberString()
	pageSize?: number

	@ApiPropertyOptional({ example: 'uuid' })
	@IsOptional()
	@IsUUID('4')
	collectionId?: string

	@ApiPropertyOptional({ example: 'text' })
	@IsOptional()
	@IsString()
	search?: string

	@ApiPropertyOptional({ example: false })
	@IsOptional()
	@IsBooleanString()
	hasFinished: boolean
}
