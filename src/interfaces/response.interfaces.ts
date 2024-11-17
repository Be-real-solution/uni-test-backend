export interface IResponse<T> {
	data: T
	status_code: number
	message: string | string[]
}
