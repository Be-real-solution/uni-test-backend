import {
	BadGatewayException,
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
import { ApiBearerAuth, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger'
import { IResponse } from 'interfaces/response.interfaces'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { PAGE_NUMBER, PAGE_SIZE } from '../../constants'
import { CheckAuthGuard } from '../../guards'
import { AdminService } from './admin.service'
import {
	AdminCreateRequestDto,
	AdminDeleteRequestDto,
	AdminFindAllRequestDto,
	AdminFindAllResponseDto,
	AdminFindFullRequestDto,
	AdminFindFullResponseDto,
	AdminFindOneRequestDto,
	AdminFindOneResponseDto,
	AdminSignInRequestDto,
	AdminSignInResponseDto,
	AdminUpdateRequestDto,
} from './dtos'
import {
	AdminFindAllResponse,
	AdminFindFullResponse,
	AdminFindOneResponse,
	AdminSignInResponse,
	AdminUpdateResponse,
} from './interfaces'

@ApiTags('Admin')
@UseGuards(CheckAuthGuard)
@Controller('admin')
export class AdminController {
	private readonly service: AdminService

	constructor(service: AdminService) {
		this.service = service
	}

	@Get('full')
	@ApiBearerAuth()
	@ApiResponse({ type: AdminFindFullResponseDto, isArray: true })
	findFull(@Query() payload: AdminFindFullRequestDto): Promise<IResponse<AdminFindFullResponse>> {
		return this.service.findFull(payload)
	}

	@Get('all')
	@ApiBearerAuth()
	@ApiResponse({ type: AdminFindAllResponseDto })
	findAll(@Query() payload: AdminFindAllRequestDto): Promise<IResponse<AdminFindAllResponse>> {
		return this.service.findAll({ ...payload, pageSize: PAGE_SIZE, pageNumber: PAGE_NUMBER })
	}

	@Get(':id')
	@ApiBearerAuth()
	@ApiResponse({ type: AdminFindOneResponseDto })
	findOne(@Param() payload: AdminFindOneRequestDto): Promise<IResponse<AdminFindOneResponse>> {
		return this.service.findOne(payload)
	}

	@Post()
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
	create(
		@Body() payload: AdminCreateRequestDto,
		@UploadedFile() image: Express.Multer.File,
	): Promise<IResponse<AdminFindOneResponse>> {
		const imagePath = image ? `/uploads/${image.filename}` : ''
		return this.service.create({ ...payload, image: imagePath })
	}

	@Post('sign-in')
	@ApiResponse({ type: AdminSignInResponseDto })
	signIn(@Body() payload: AdminSignInRequestDto): Promise<IResponse<AdminSignInResponse>> {
		return this.service.singIn(payload)
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
		@Param() params: AdminFindOneRequestDto,
		@Body() payload: AdminUpdateRequestDto,
		@UploadedFile() image?: Express.Multer.File,
	): Promise<IResponse<AdminUpdateResponse>> {
		const imagePath = image ? `/uploads/${image.filename}` : undefined
		return this.service.update(params, { ...payload, image: imagePath })
	}

	@Delete(':id')
	@ApiBearerAuth()
	@ApiResponse({ type: null })
	delete(@Param() payload: AdminDeleteRequestDto): Promise<IResponse<[]>> {
		return this.service.delete(payload)
	}
}
