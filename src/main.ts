import { json } from 'express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { appConfig } from './configs'
import * as BasicAuth from 'express-basic-auth'
import * as express from 'express'
import { join } from 'path'

setImmediate(async (): Promise<void> => {
	const app = await NestFactory.create<INestApplication>(AppModule, { cors: true })

	app.use(json({ limit: '50mb' }))
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
	app.use('/api/upload', express.static(join(__dirname, '../../uploads')))

	app.use(
		'/docs*',
		BasicAuth({
			challenge: true,
			users: {
				[appConfig.swagger_login]: appConfig.swagger_password,
			},
		}),
	)

	const swaggerConfig = new DocumentBuilder()
		.addBearerAuth({
			description: `[just text field] Please enter token in following format: Bearer <JWT>`,
			name: 'Authorization',
			bearerFormat: 'Bearer',
			scheme: 'Bearer',
			type: 'http',
			in: 'Header',
		})
		.build()
	const document = SwaggerModule.createDocument(app, swaggerConfig)
	SwaggerModule.setup('docs', app, document, {})

	console.log('app config:', appConfig)

	await app.listen(appConfig.port, appConfig.host)
})
