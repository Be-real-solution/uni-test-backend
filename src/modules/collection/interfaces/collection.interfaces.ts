import { CollectionLanguageEnum } from '@prisma/client'
import { ScienceFindOneResponse } from '../../science'
import { QuestionFindOneResponse } from '../../question'
import { AdminFindOneResponse } from '../../admin'
import { IFindOneDirectoryResponse } from 'modules/directory/interfaces'

export declare interface CollectionFindFullRequest {
	name?: string
	language?: CollectionLanguageEnum
	scienceId?: string
	adminId?: string
	directoryId?: string
}

export declare interface CollectionFindAllRequest {
	pageNumber?: number
	pageSize?: number
	name?: string
	language?: CollectionLanguageEnum
	scienceId?: string
	adminId?: string
}

export declare interface CollectionFindOneRequest {
	id: string
}

export declare interface CollectionCreateRequest {
	name: string
	language: CollectionLanguageEnum
	scienceId: string
	maxAttempts: number
	givenMinutes: number
	amountInTest: number
	adminId: string
	directoryId: string
}

export declare interface CollectionBeforeCreateRequest {
	name?: string
	language?: CollectionLanguageEnum
	scienceId?: string
	maxAttempts?: number
	givenMinutes?: number
	amountInTest?: number
	adminId?: string
	directoryId?: string
}

export declare interface CollectionUpdateRequest {
	name?: string
	language?: CollectionLanguageEnum
	scienceId?: string
	maxAttempts?: number
	givenMinutes?: number
	amountInTest?: number
	adminId?: string
	directoryId?: string
}

export declare interface CollectionDeleteRequest {
	id: string
}

//=========================

export declare type CollectionFindFullResponse = CollectionFindOneResponse[]

export declare interface CollectionFindAllResponse {
	totalCount: number
	pageSize: number
	pageCount: number
	data: CollectionFindOneResponse[]
}

export declare interface CollectionFindOneResponse {
	id: string
	name: string
	language: string
	science?: ScienceFindOneResponse
	maxAttempts: number
	givenMinutes: number
	amountInTest: number
	questions?: QuestionFindOneResponse[]
	admin?: AdminFindOneResponse
	directory?: IFindOneDirectoryResponse
	createdAt: Date
}

export declare interface CollectionFindOneWithQuestionAnswers {
	id: string
	name: string
	language: string
	science?: ScienceFindOneResponse
	maxAttempts: number
	givenMinutes: number
	amountInTest: number
	admin?: AdminFindOneResponse
	questions: CollectionQuestion[]
	createdAt: Date
}

export declare interface CollectionQuestion {
	id: string
	text: string
	createdAt: Date
	imageUrl: string
	multipleChoice?: boolean
	answers: QuestionAnswer[]
}

export declare interface QuestionAnswer {
	id: string
	text: string
	isCorrect: boolean
	createdAt: Date
}

export declare type CollectionCreateResponse = CollectionFindOneResponse

export type CollectionUpdateResponse = CollectionUpdateRequest

export declare type CollectionDeleteResponse = null

export declare interface CollectionBeforeCreateResponse {
	name: string
	language: CollectionLanguageEnum
	science: Pick<ScienceFindOneResponse, 'name' | 'id'>
	maxAttempts: number
	givenMinutes: number
	amountInTest: number
	adminId: string
	directoryId: string
	questions: ColBeforeQuestion[]
}

export declare interface ColBeforeQuestion {
	text: string
	answers: ColBeforeQuestionAnswer[]
}

export declare interface ColBeforeQuestionAnswer {
	text: string
	isCorrect: boolean
}
