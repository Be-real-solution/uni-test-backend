export interface ISettingResponse {
	id: string
	name: string
	status: boolean
	createdAt: Date
	updatedAt: Date
}

export interface ICreateSetting {
	name: string
	status?: boolean
}

export interface IUpdateSetting {
	name?: string
	status?: boolean
}
