export declare interface ICreateDirectory {
	name: string
	parentId?: string
}

export declare interface IFindOneDirectoryResponse {
	id: string
	name: string
  parentId: string
	createdAt: Date
	parent?: IFindOneDirectoryResponse
	children?: IFindOneDirectoryResponse[]
}

export declare interface IFindOneByParentIdOrName {
	id?: string
	name?: string
}

export declare interface IUpdateDirectory {
	name?: string
	parentId?: string
}

export declare interface ICreateDirectoryResponse extends IFindOneDirectoryResponse {}
