import { CollectionFindOneResponse } from 'modules/collection'
import { GroupFindOneResponse } from 'modules/group'
import { QuestionFindOneResponse } from 'modules/question'
import { UserFindOneResponse } from 'modules/user'

export declare interface IUserResultAnswerDataResponse {
	id?: string
	userResultId: string
	correctAnswerCount: number
	findAnswerCount: number
	getTime: string
	createdAt?: Date

}

export declare interface IUserResultAnswerDataCreate {
	userResultId: string
	correctAnswerCount: number
	findAnswerCount: number
	getTime: string
	questionNumber: number
}

export declare interface IUserResultResponse {
	id: string
	userId: string
	collectionId: string
	compyuterName: string
	hemisId: string
	grade: number
	userFullName: string
	allQuestionCount: number
	findQuestionCount: number
	hasFinished: boolean
	groupName: string
	course: number
	facultyName: string
	startTime: Date
	endTime: Date
	createdAt: Date
	userResultAnswerData?: IUserResultAnswerDataResponse[]
}


export declare interface ICreateUserResultRepository {
	compyuterName: string
	grade: number
	hemisId: string
	userFullName: string
	allQuestionCount: number
	findQuestionCount?: number
	hasFinished?: boolean
	createdAt?: Date
	userId: string
	groupName: string
	course: number
	facultyName: string
	collectionId: string
	startTime: Date
	endTime: Date
}

export declare interface ICreateUserResultService {
	questionId: string
	questionNumber: number
	getTime: string
	computerName: string
	answer: { answerId: string }[]
	startTime: Date
	endTime: Date
}

export declare interface IUpdateUserResultRepository {
	id: string
	compyuterName?: string
	hemisId?: string
	grade?: number
	userFullName?: string
	allQuestionCount?: number
	findQuestionCount?: number
	hasFinished?: boolean
	createdAt?: Date
	userId?: string
	groupName?: string
	course?: number
	facultyName?: string
	collectionId?: string
	startTime?: string
	endTime?: string
}

export declare interface IUserResultFindAllResponse {
	totalCount: number
	pageSize: number
	pageCount: number
	data: IUserResultResponse[]
}

export declare interface IUserResultFindAll {
	pageNumber?: number

	pageSize?: number

	collectionId?: string

	userId?: string

	fullName?: string

	faculty?: string

	group?: string

	hemisId?: string

	computerName?: string

	course?: number

	grade?: number

	hasFinished?: boolean
}
