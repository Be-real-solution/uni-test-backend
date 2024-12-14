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
	compyuterName: string
	grade: number
	userFullName: string
	allQuestionCount: number
	findQuestionCount: number
	hasFinished: boolean
	groupName: string
	course: number
	facultyName: string
	createdAt: Date
	user?: UserFindOneResponse
	userResultAnswerData?: IUserResultAnswerDataResponse[]
	collection?: CollectionFindOneResponse
}


export declare interface ICreateUserResultRepository {
	compyuterName: string
	grade: number
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
}

export declare interface ICreateUserResultService {
	questionId: string
	userId: string
	hasFinished: boolean
	questionNumber: number
	getTime: string
	computerName: string
	answer: { answerId: string }[]
}

export declare interface IUpdateUserResultRepository {
	id: string
	compyuterName?: string
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

	search?: string

	hasFinished?: boolean
}
