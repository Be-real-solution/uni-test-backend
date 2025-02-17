// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface ScienceFindFullRequest {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface ScienceFindAllRequest {
	pageNumber?: number
	pageSize?: number
}

export declare interface ScienceFindOneRequest {
	id: string
}

export declare interface ScienceCreateRequest {
	name: string
	since_id?: number
}

export declare interface ScienceUpdateRequest {
	name?: string
}

export declare interface ScienceDeleteRequest {
	id: string
}

//=========================

export declare type ScienceFindFullResponse = ScienceFindOneResponse[]

export declare interface ScienceFindAllResponse {
	totalCount: number
	pageSize: number
	pageCount: number
	data: ScienceFindOneResponse[]
}

export declare interface ScienceFindOneResponse {
	id: string
	name: string
	since_id: number
	createdAt: Date
}

export declare interface ScienceFindFullForArchive {
	id: string
	name: string
	createdAt: Date
	collections: ScienceCollection[]
}

export declare interface ScienceCollection {
	id: string
	amountInTest: number
	createdAt: Date
	givenMinutes: number
	maxAttempts: number
	language: string
	name: string
	archives: ScienceCollectionArchive[]
}

export declare interface ScienceCollectionArchive {
	id: string
	testCount: number
	result: number
	course: ScienceCollectionArchiveCourse
	faculty: ScienceCollectionArchiveFaculty
}

export declare interface ScienceCollectionArchiveCourse {
	id: string
	stage: number
}

export declare interface ScienceCollectionArchiveFaculty {
	id: string
	name: string
}

export declare interface ScienceCollectionArchiveSemestr {
	id: string
	stage: number
}

export declare type ScienceCreateResponse = null

export declare type ScienceUpdateResponse = null

export declare type ScienceDeleteResponse = null

export declare interface ScienceFindOnwWithUserCollectionRequest {
	userId?: string
}

export declare interface ScienceFindOneWithUserCollection {
	id: string
	name: string
	collections: ScienceCollection2[]
}

export declare interface ScienceCollection2 {
	id: string
	name: string
	language: string
	maxAttempts: number
	givenMinutes: number
	amountInTest: number
	userCollections: ScienceUserCollection[]
}

export declare interface ScienceUserCollection {
	user: { id: string; fullName: string }
	haveAttempt: number
}
