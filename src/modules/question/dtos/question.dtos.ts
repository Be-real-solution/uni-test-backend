import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
	QuestionCreateRequest,
	QuestionDeleteRequest,
	QuestionFindAllRequest,
	QuestionFindAllResponse,
	QuestionFindFullRequest,
	QuestionFindOneRequest,
	QuestionFindOneResponse,
	QuestionUpdateRequest,
	QuestionsCreateWithAnswersRequest,
} from '../interfaces'
import {
	IsBoolean,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
	ValidateNested,
} from 'class-validator'
import { CollectionFindOneResponse, CollectionFindOneResponseDto } from '../../collection'
import { Type } from 'class-transformer'

export class QuestionFindFullRequestDto implements QuestionFindFullRequest {
	@ApiPropertyOptional({ example: 'uuid' })
	@IsUUID('4')
	@IsOptional()
	collectionId?: string

	@ApiPropertyOptional({ example: 'text' })
	@IsString()
	@IsOptional()
	text?: string
}

export class QuestionFindAllRequestDto implements QuestionFindAllRequest {
	@ApiPropertyOptional({ example: 5 })
	@IsNumber()
	@IsOptional()
	pageNumber?: number

	@ApiPropertyOptional({ example: 5 })
	@IsNumber()
	@IsOptional()
	pageSize?: number

	@ApiPropertyOptional({ example: 'uuid' })
	@IsUUID('4')
	@IsOptional()
	collectionId?: string

	@ApiPropertyOptional({ example: 'text' })
	@IsString()
	@IsOptional()
	text?: string
}

export class QuestionFindOneRequestDto implements QuestionFindOneRequest {
	@ApiProperty({ example: 'uuid' })
	@IsUUID('4')
	@IsNotEmpty()
	id: string
}

export class QuestionCreateRequestDto implements QuestionCreateRequest {
	@ApiProperty({ example: 'text' })
	@IsString()
	@IsNotEmpty()
	text: string

	@ApiProperty({ example: 'uuid' })
	@IsUUID('4')
	@IsNotEmpty()
	collectionId: string
}

export class QuestionsCreateWithAnswersDto
	implements Pick<QuestionsCreateWithAnswersRequest, 'collectionId'>
{
	@ApiProperty({ type: 'string', format: 'binary', description: 'TXT file' })
	file: any

	@ApiProperty({ example: 'uuid' })
	@IsUUID('4')
	@IsNotEmpty()
	collectionId: string
}

export class AnswerUpdateForQuestionDto {
	@ApiPropertyOptional({ example: 'UUID' })
	@IsUUID('4')
	@IsNotEmpty()
	id: string

	@ApiPropertyOptional({ example: 'text' })
	@IsString()
	@IsNotEmpty()
	text: string

	@ApiPropertyOptional({ example: 'uuid' })
	@IsUUID('4')
	@IsNotEmpty()
	questionId: string

	@ApiPropertyOptional({ example: true })
	@IsBoolean()
	@IsNotEmpty()
	isCorrect: boolean
}

export class QuestionUpdateRequestDto implements QuestionUpdateRequest {
	@ApiPropertyOptional({ example: 'text' })
	@IsString()
	@IsOptional()
	text?: string

	@ApiPropertyOptional({ example: 'uuid' })
	@IsUUID('4')
	@IsOptional()
	collectionId?: string

	@ApiPropertyOptional({ examples: AnswerUpdateForQuestionDto })
	@ValidateNested({ each: true })
	@Type(() => AnswerUpdateForQuestionDto)
	@IsOptional()
	answers?: AnswerUpdateForQuestionDto[]
}

export class QuestionDeleteRequestDto implements QuestionDeleteRequest {
	@ApiProperty({ example: 'uuid' })
	@IsUUID('4')
	@IsNotEmpty()
	id: string
}

//=======================

export class QuestionFindFullResponseDto implements QuestionFindOneResponse {
	@ApiProperty({ example: 'uuid' })
	id: string

	@ApiProperty({ example: 'text' })
	text: string

	@ApiProperty({ example: 'image url' })
	imageUrl: string

	@ApiProperty({ type: CollectionFindOneResponseDto })
	collection: CollectionFindOneResponse

	@ApiProperty({ example: new Date() })
	createdAt: Date
}

export class QuestionFindOneResponseDto implements QuestionFindOneResponse {
	@ApiProperty({ example: 'uuid' })
	id: string

	@ApiProperty({ example: 'text' })
	text: string

	@ApiProperty({ example: 'image url' })
	imageUrl: string

	@ApiProperty({ type: CollectionFindOneResponseDto })
	collection: CollectionFindOneResponse

	@ApiProperty({ example: new Date() })
	createdAt: Date
}

export class QuestionFindAllResponseDto implements QuestionFindAllResponse {
	@ApiProperty({ example: 10 })
	totalCount: number

	@ApiProperty({ example: 10 })
	pageCount: number

	@ApiProperty({ example: 10 })
	pageSize: number

	@ApiProperty({ type: QuestionFindOneResponseDto, isArray: true })
	data: QuestionFindOneResponse[]
}
