import { AppConfigOptions } from '../interfaces'

export const appConfig: AppConfigOptions = {
	host: process.env.APP_HOST ?? '127.0.0.1',
	port: process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3000,
	path_for_file_upload: process.env.PATH_FOR_FILE_UPLOAD as string,
	file_size: Number(process.env.FILE_SIZE),
	swagger_login: process.env.SWAGGER_LOGIN,
	swagger_password: process.env.SWAGGER_PASSWORD,
}
