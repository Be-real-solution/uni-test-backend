import { CollectionFindOneResponse } from 'modules/collection'
import { GroupFindOneResponse } from 'modules/group'
import { QuestionFindOneResponse } from 'modules/question'
import { UserFindOneResponse } from 'modules/user'

export declare interface IUserResultResponse {
	id: string
	compyuterName: string
	grade: number
	userFullName: string
	questionCount: number
	questionFindCount: number
	hasFinished: boolean
	createdAt: Date
	question?: QuestionFindOneResponse
	group?: GroupFindOneResponse
	user?: UserFindOneResponse
	collection?: CollectionFindOneResponse
}

export declare interface ICreateUserResultRepository {
	compyuterName: string
	grade: number
	userFullName: string
	questionCount?: number
	questionFindCount?: number
	hasFinished?: boolean
	createdAt?: Date
	userId: string
	collectionId: string
	groupId: string
	questionId?: string
}

export declare interface ICreateUserResultService {
	questionId: string
	userId: string
	hasFinished: boolean
	number: number
}

export declare interface IUpdateUserResultRepository {
	id: string
	compyuterName?: string
	grade?: number
	userFullName?: string
	questionCount?: number
	questionFindCount?: number
	hasFinished?: boolean
	createdAt?: Date
	userId?: string
	collectionId?: string
	groupId?: string
	questionId?: string
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
