// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface FacultyFindFullRequest {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface FacultyFindAllRequest {
	pageNumber?: number
	pageSize?: number
}

export declare interface FacultyFindOneRequest {
	id: string
}

export declare interface FacultyFindFullForSetCollection {
	id: string
	name: string
	courses?: FacultyCourse[]
}

export declare interface FacultyCourse {
	id: string
	stage: number
	groups: FacultyCourseSemestrGroup[]
}

export declare interface FacultyCourseSemestr {
	id: string
	stage: number
	groups: FacultyCourseSemestrGroup[]
}

export declare interface FacultyCourseSemestrGroup {
	id: string
	name: string
	students: FacultyCourseSemestrGroupStudent[]
}

export declare interface FacultyCourseSemestrGroupStudent {
	id: string
	fullName: string
}

export declare interface FacultyCreateRequest {
	name: string
}

export declare interface FacultyUpdateRequest {
	name?: string
}

export declare interface FacultyDeleteRequest {
	id: string
}

//=========================

export declare type FacultyFindFullResponse = FacultyFindOneResponse[]

export declare interface FacultyFindAllResponse {
	totalCount: number
	pageSize: number
	pageCount: number
	data: FacultyFindOneResponse[]
}

export declare interface FacultyFindOneResponse {
	id: string
	name: string
	createdAt: Date
}

export declare type FacultyCreateResponse = null

export declare type FacultyUpdateResponse = null

export declare type FacultyDeleteResponse = null
