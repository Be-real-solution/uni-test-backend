import { UserFindOneResponse } from '../../user'
import { CollectionFindOneResponse } from '../../collection'

export declare interface UserCollectionFindFullRequest {
	userId?: string
	collectionId?: string
}

export declare interface UserCollectionFindAllRequest {
	pageNumber?: number
	pageSize?: number
	userId?: string
	collectionId?: string
	isMakeup?: boolean
}

export declare interface UserCollectionFindOneRequest {
	id: string
}

export declare interface UserCollectionCreateRequest {
	haveAttempt: number
	userId: string
	collectionId: string
	isMakeup?: boolean
}

export declare interface UserCollectionCreateByHemisIdRequest {
	haveAttempt: number
	hemisId: string
	collectionId: string
	isMakeup?: boolean
}

export declare interface UserCollectionCreateManyRequest {
	userCollections: UserCollectionCreateRequest[]
}

export declare interface UserCollectionUpdateRequest {
	haveAttempt?: number
	userId?: string
	collectionId?: string
}

export declare interface UserCollectionDeleteRequest {
	id: string
}

//=========================

export declare type UserCollectionFindFullResponse = UserCollectionFindOneResponse[]

export declare interface UserCollectionFindAllResponse {
	totalCount: number
	pageSize: number
	pageCount: number
	data: UserCollectionFindOneResponse[]
}

export declare interface UserCollectionFindOneResponse {
	id: string
	haveAttempt: number
	isMakeup?: boolean
	user?: UserFindOneResponse
	collection?: CollectionFindOneResponse
	createdAt: Date
}

export declare type UserCollectionCreateResponse = { statusCode: number; data: []; message: string }

export declare type UserCollectionUpdateResponse = null

export declare type UserCollectionDeleteResponse = null
