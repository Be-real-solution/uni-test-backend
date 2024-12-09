import {
	BadGatewayException,
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger'
import { isEmail } from 'class-validator'
import { IResponse } from 'interfaces/response.interfaces'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { PAGE_NUMBER, PAGE_SIZE } from '../../constants'
import { CheckAuthGuard } from '../../guards'
import { AdminService } from '../admin'
import {
	UserCreateManyWithJsonFileDto,
	UserCreateWithInfoRequestDto,
	UserDeleteRequestDto,
	UserFindAllRequestDto,
	UserFindAllResponseDto,
	UserFindFullRequestDto,
	UserFindFullResponseDto,
	UserFindOneRequestDto,
	UserFindOneResponseDto,
	UserSignInRequestDto,
	UserSignInResponseDto,
	UserUpdateWithInfoRequestDto,
} from './dtos'
import {
	UserCreateResponse,
	UserFindAllResponse,
	UserFindFullResponse,
	UserFindOneResponse,
	UserSignInResponse,
	UserUpdateResponse,
} from './interfaces'
import { UserService } from './user.service'

@ApiTags('User')
@UseGuards(CheckAuthGuard)
@Controller('user')
export class UserController {
	private readonly service: UserService
	private readonly adminService: AdminService

	constructor(service: UserService, adminService: AdminService) {
		this.service = service
		this.adminService = adminService
	}

	@Get('full')
	@ApiBearerAuth()
	@ApiResponse({ type: UserFindFullResponseDto, isArray: true })
	findFull(@Query() payload: UserFindFullRequestDto): Promise<IResponse<UserFindFullResponse>> {
		return this.service.findFull(payload)
	}

	@Get('all')
	@ApiBearerAuth()
	@ApiResponse({ type: UserFindAllResponseDto })
	findAll(@Query() payload: UserFindAllRequestDto): Promise<IResponse<UserFindAllResponse>> {
		return this.service.findAll({ ...payload, pageSize: PAGE_SIZE, pageNumber: PAGE_NUMBER })
	}

	@Get(':id')
	@ApiBearerAuth()
	@ApiResponse({ type: UserFindOneResponseDto })
	findOne(@Param() payload: UserFindOneRequestDto): Promise<IResponse<UserFindOneResponse>> {
		return this.service.findOne(payload)
	}

	// @Post()
	// @ApiBearerAuth()
	// @UseInterceptors(
	// 	FileInterceptor('image', {
	// 		storage: diskStorage({
	// 			destination: join(__dirname, '..', '..', '..', 'images'),
	// 			filename: (req, file, callback) => {
	// 				const uniqueSuffix = `${uuidv4()}-${Date.now()}`
	// 				const ext = extname(file.originalname)
	// 				const filename = `${uniqueSuffix}${ext}`
	// 				callback(null, filename)
	// 			},
	// 		}),
	// 		fileFilter: (req, file, callback) => {
	// 			if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
	// 				return callback(new BadGatewayException('Only image files are allowed!'), false)
	// 			}
	// 			callback(null, true)
	// 		},
	// 	}),
	// )
	// @ApiConsumes('multipart/form-data')
	// @ApiResponse({ type: null })
	// create(@Body() payload: UserCreateRequestDto, @UploadedFile() image: Express.Multer.File): Promise<UserCreateResponse> {
	// 	const imagePath = image ? `/uploads/${image.filename}` : ''
	// 	return this.service.create({ ...payload, image: imagePath })
	// }

	@Post('with-info')
	@ApiBearerAuth()
	@UseInterceptors(
		FileInterceptor('image', {
			storage: diskStorage({
				destination: join(__dirname, '..', '..', '..', 'images'),
				filename: (req, file, callback) => {
					const uniqueSuffix = `${uuidv4()}-${Date.now()}`
					const ext = extname(file.originalname)
					const filename = `${uniqueSuffix}${ext}`
					callback(null, filename)
				},
			}),
			fileFilter: (req, file, callback) => {
				if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
					return callback(new BadGatewayException('Only image files are allowed!'), false)
				}
				callback(null, true)
			},
		}),
	)
	@ApiConsumes('multipart/form-data')
	@ApiResponse({ type: null })
	createWithInfo(
		@Body() payload: UserCreateWithInfoRequestDto,
		@UploadedFile() image: Express.Multer.File,
	): Promise<IResponse<UserCreateResponse>> {
		const imagePath = image ? `/uploads/${image.filename}` : ''

		return this.service.createWithUserInfo({ ...payload, image: imagePath })
	}

	@Post('sign-in')
	@ApiResponse({ type: UserSignInResponseDto })
	async signIn(@Body() payload: UserSignInRequestDto): Promise<IResponse<UserSignInResponse>> {
		const isemail = isEmail(payload.hemisId)
		if (isemail) {
			const { data: adminResponse } = await this.adminService.singIn(payload)
			return {
				status_code: 200,
				data: { user: adminResponse.admin, tokens: adminResponse.tokens },
				message: 'success',
			}
		} else {
			return this.service.singIn(payload)
		}
	}

	@Post('with-json')
	@ApiBearerAuth()
	@UseInterceptors(
		FileInterceptor('file', {
			fileFilter: (req, file, cb) => {
				if (file.mimetype !== 'application/json') {
					return cb(new BadRequestException('Invalid file type'), false)
				}
				cb(null, true)
			},
		}),
	)
	@ApiBody({
		description: 'Payload with json file',
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
			required: ['file'],
		},
	})
	@ApiConsumes('multipart/form-data')
	@ApiResponse({ type: null })
	createManyWithJson(@UploadedFile() file: any): Promise<IResponse<[]>> {
		if (file) {
			const data = file.buffer.toString('utf8')
			const jsonData: UserCreateManyWithJsonFileDto[] = JSON.parse(data)

			return this.service.createManyWithJsonFile(jsonData)
		} else {
			return null
		}
	}

	@Patch(':id')
	@ApiBearerAuth()
	@UseInterceptors(
		FileInterceptor('image', {
			storage: diskStorage({
				destination: join(__dirname, '..', '..', '..', 'images'),
				filename: (req, file, callback) => {
					const uniqueSuffix = `${uuidv4()}-${Date.now()}`
					const ext = extname(file.originalname)
					const filename = `${uniqueSuffix}${ext}`
					callback(null, filename)
				},
			}),
			fileFilter: (req, file, callback) => {
				if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
					return callback(new BadGatewayException('Only image files are allowed!'), false)
				}
				callback(null, true)
			},
		}),
	)
	@ApiConsumes('multipart/form-data')
	@ApiResponse({ type: null })
	update(
		@Param() params: UserFindOneRequestDto,
		@Body() payload: UserUpdateWithInfoRequestDto,
		@UploadedFile() image: Express.Multer.File,
	): Promise<IResponse<UserUpdateResponse>> {
		const imagePath = image ? `/uploads/${image.filename}` : undefined
		return this.service.updateWithUserInfo(params, { ...payload, image: imagePath })
	}

	@Delete(':id')
	@ApiBearerAuth()
	@ApiResponse({ type: null })
	delete(@Param() payload: UserDeleteRequestDto): Promise<IResponse<[]>> {
		return this.service.delete(payload)
	}
}
