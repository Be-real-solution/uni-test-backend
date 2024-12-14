import { AnswerUpdateRequest } from 'modules/answer'
import { CollectionFindOneResponse } from '../../collection'

export declare interface QuestionFindFullRequest {
	text?: string
	collectionId?: string
}

export declare interface QuestionFindAllRequest {
	pageNumber?: number
	pageSize?: number
	text?: string
	collectionId?: string
}

export declare interface QuestionFindOneRequest {
	id: string
}

export declare interface QuestionCreateRequest {
	text: string
	collectionId: string
}

export declare interface QuestionsCreateWithAnswersRequest {
	collectionId: string
	questions: QuestionDefinition[]
}

export declare interface QuestionDefinition {
	text: string
	answers: AnswerDefinition[]
}

export declare interface AnswerDefinition {
	text: string
	isCorrect: boolean
}

export declare interface AnswerUpdateRequestForQuestionUpdate extends AnswerUpdateRequest {
	id: string
	text: string
	isCorrect: boolean
	questionId: string
}

export declare interface QuestionUpdateRequest {
	text?: string
	imageUrl?: string
	collectionId?: string
	answers?: AnswerUpdateRequestForQuestionUpdate[]
}

export declare interface QuestionDeleteRequest {
	id: string
}

//=========================

export declare type QuestionFindFullResponse = QuestionFindOneResponse[]

export declare interface QuestionFindAllResponse {
	totalCount: number
	pageSize: number
	pageCount: number
	data: QuestionFindOneResponse[]
}

export declare interface AnswerFindOneForQuestionResponse {
	id: string
	text: string
	isCorrect: boolean
	createdAt: Date
}

export declare interface QuestionFindOneResponse {
	id: string
	text: string
	imageUrl: string
	answers?: AnswerFindOneForQuestionResponse[]
	collection?: CollectionFindOneResponse
	createdAt: Date
}

export declare type QuestionCreateResponse = QuestionFindOneResponse

export declare type QuestionsCreateWithAnswersResponse = null

export declare type QuestionUpdateResponse = null

export declare type QuestionDeleteResponse = null
