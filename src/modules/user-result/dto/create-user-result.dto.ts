import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsBooleanString,
	IsNotEmpty,
	IsNumber,
	IsNumberString,
	IsOptional,
	IsString,
	IsUUID,
	ValidateNested
} from 'class-validator'
import {
	IUserResultAnswerDataResponse,
	IUserResultFindAll,
	IUserResultFindAllResponse,
	IUserResultResponse,
} from '../interfaces/user-result.interfaces'

export class UserResultAnswerDataDto {
	@ApiProperty({ example: 'UUID' })
	@IsNotEmpty()
	@IsUUID('4')
	answerId: string
}

export class CreateUserResultDto {
	@ApiProperty({ example: 'UUID' })
	@IsOptional()
	@IsUUID('4')
	questionId: string


	@ApiProperty({ example: 2 })
	@IsNotEmpty()
	@IsNumber()
	questionNumber: number

	@ApiProperty({ type: UserResultAnswerDataDto, isArray: true })
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => UserResultAnswerDataDto)
	answer: UserResultAnswerDataDto[]

	@ApiProperty({ example: '00:00' })
	@IsNotEmpty()
	@IsString()
	getTime: string

	@ApiProperty({ example: 'PC14' })
	@IsNotEmpty()
	@IsString()
	computerName: string

	@ApiPropertyOptional({ example: '2024-01-01T00:00:00.000Z' })
	@IsOptional()
	@IsString()
	startTime: Date

	@ApiPropertyOptional({ example: '2024-01-01T00:00:00.000Z' })
	@IsOptional()
	@IsString()
	endTime: Date
}

/** for swagger */
export class UserResultAnswerDataResponseDto implements IUserResultAnswerDataResponse {
	@ApiProperty({ example: 'UUID' })
	id: string

	@ApiProperty({ example: "text" })
	questionName: string

	@ApiProperty({ example: 1 })
	correctAnswerCount: number

	@ApiProperty({ example: 1 })
	findAnswerCount: number

	@ApiProperty({ example: '00:00' })
	getTime: string

	@ApiProperty({ example: 'UUID' })
	userResultId: string

	@ApiProperty({ example: new Date() })
	createdAt?: Date

}

/** for swagger */
export class UserResultResponseDto implements IUserResultResponse {
	@ApiProperty({ example: 'UUID' })
	id: string

	@ApiProperty({ example: 'computer name' })
	compyuterName: string

	@ApiProperty({ example: 'collection name' })
	collectionName: string

	@ApiProperty({ example: '1233242' })
	hemisId: string

	@ApiProperty({ example: 'ALI Akmalov' })
	userFullName: string

	@ApiProperty({ example: '41 gurux' })
	groupName: string

	@ApiProperty({ example: 'Axborot texnologiyalari' })
	facultyName: string

	@ApiProperty({ example: 2 })
	course: number

	@ApiProperty({ example: 4 })
	grade: number

	@ApiProperty({ example: 10 })
	allQuestionCount: number

	@ApiProperty({ example: 30 })
	findQuestionCount: number

	@ApiProperty({ example: true })
	hasFinished: boolean


	@ApiProperty({ example: new Date() })
	createdAt: Date

	@ApiProperty({ example: new Date() })
	startTime: Date
	
	@ApiProperty({ example: new Date() })
	endTime: Date

	@ApiPropertyOptional({ example: "UUID" })
	userId: string

	@ApiPropertyOptional({ example: "UUID" })
	collectionId: string

	@ApiProperty({ type: UserResultAnswerDataResponseDto, isArray: true })
	userResultAnswerData: UserResultAnswerDataResponseDto[]
}

/** for swagger */
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

	@ApiPropertyOptional({ example: 'uuid' })
	@IsOptional()
	@IsUUID('4')
	userId?: string

	@ApiPropertyOptional({ example: 'text' })
	@IsOptional()
	@IsString()
	fullName?: string

	@ApiPropertyOptional({ example: 'text' })
	@IsOptional()
	@IsString()
	faculty?: string

	@ApiPropertyOptional({ example: 'text' })
	@IsOptional()
	@IsString()
	group?: string

	@ApiPropertyOptional({ example: 'text' })
	@IsOptional()
	@IsString()
	hemisId?: string

	@ApiPropertyOptional({ example: 'text' })
	@IsOptional()
	@IsString()
	computerName?: string

	@ApiPropertyOptional({ example: '2' })
	@IsOptional()
	@IsNumberString()
	course?: number

	@ApiPropertyOptional({ example: '5' })
	@IsOptional()
	@IsNumberString()
	grade?: number

	@ApiPropertyOptional({ example: false })
	@IsOptional()
	@IsBooleanString()
	hasFinished?: boolean
}
