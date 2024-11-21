export declare interface AppConfigOptions {
	host: string
	port: number
	path_for_file_upload: string
	file_size: number
}

export declare interface DatabaseConfigOptions {
	url?: string
}

export declare interface JwtConfigOptions {
	accessToken: {
		key: string
		time: string
	}
	refreshToken: {
		key: string
		time: string
	}
}
