import { BadRequestException, Injectable } from '@nestjs/common'
import { AnswerRepository } from './answer.repository'
import {
	AnswerCreateOrUpdateRequest,
	AnswerCreateRequest,
	AnswerCreateResponse,
	AnswerDeleteRequest,
	AnswerDeleteResponse,
	AnswerFindAllRequest,
	AnswerFindAllResponse,
	AnswerFindFullRequest,
	AnswerFindFullResponse,
	AnswerFindOneRequest,
	AnswerFindOneResponse,
	AnswerUpdateRequest,
	AnswerUpdateResponse,
} from './interfaces'
import { deleteFile } from 'libs/fileService'

@Injectable()
export class AnswerService {
	private readonly repository: AnswerRepository
	constructor(repository: AnswerRepository) {
		this.repository = repository
	}

	async findFull(payload: AnswerFindFullRequest): Promise<AnswerFindFullResponse> {
		const answers = this.repository.findFull(payload)
		return answers
	}

	async findAll(payload: AnswerFindAllRequest): Promise<AnswerFindAllResponse> {
		const answers = this.repository.findAll(payload)
		return answers
	}

	async findOne(payload: AnswerFindOneRequest): Promise<AnswerFindOneResponse> {
		const answer = await this.repository.findOne(payload)
		if (!answer) {
			throw new BadRequestException('Answer not found')
		}
		return answer
	}

	async findOneByTextWithQuestionId(
		payload: Partial<AnswerCreateRequest>,
	): Promise<AnswerFindOneResponse> {
		const answer = await this.repository.findByTextWithQuestionId({
			text: payload.text,
			questionId: payload.questionId,
		})
		if (answer) {
			throw new BadRequestException('Answer already exists')
		}
		return answer
	}

	async create(payload: AnswerCreateRequest): Promise<AnswerCreateResponse> {
		await this.findOneByTextWithQuestionId({
			text: payload.text,
			questionId: payload.questionId,
		})
		return this.repository.create(payload)
	}

	async update(
		params: AnswerFindOneRequest,
		payload: AnswerUpdateRequest,
	): Promise<AnswerUpdateResponse> {
		await this.findOne({ id: params.id })
		payload.text
			? await this.findOneByTextWithQuestionId({
					text: payload.text,
					questionId: payload.questionId,
			  })
			: null

		await this.repository.update({ ...params, ...payload })
		return null
	}

	async delete(payload: AnswerDeleteRequest): Promise<AnswerDeleteResponse> {
		await this.findOne(payload)
		await this.repository.delete(payload)
		return null
	}

	async createOrUpdate(payload: AnswerCreateOrUpdateRequest, file: Express.Multer.File) {

		if (payload.id) {
			const answer = await this.repository.findOne({ id: payload.id })
			if (!answer) {
				throw new BadRequestException('Answer not found')
			}

			if (file) {
				await deleteFile(answer.imageUrl)
			}

			await this.repository.update({ id: payload.id, ...payload, imageUrl: file?.filename })
			return await this.repository.findOne({ id: payload.id })
		}
		return this.repository.create({ ...payload, imageUrl: file?.filename })
	}

	async deleteAnswerFile(params: AnswerFindOneRequest) {
		const answer = await this.repository.findOne({ id: params.id })
		if (!answer) {
			throw new BadRequestException('Answer not found')
		}
		await deleteFile(answer.imageUrl)
		await this.repository.update({ id: params.id, imageUrl: null })
		return await this.repository.findOne({ id: params.id })




















let f = {
	"START": {
		"text": {"en": "🎥 Video Guide for Registration!", "ru": "🎥 Видеоурок по регистрации!", "uz": "🎥 Ro'yxatdan o'tish uchun video qo‘llanma!", "zh": "🎥 注册视频指南！"}, 
		"photo": ["", ""], 
		"video": {
			"abusahiyVideo": {"uz": "BAACAgUAAxkBAAEOa9tn443hBZitm-Pcm_MR6FY6y2i7TgACjBYAAkHFGVezjw8E3gJd1zYE", "ru": "", "en": "", "zh": ""}, 
			"ipostVideo": {"uz": "", "ru": "", "en": "", "zh": ""}
		}
	}, 
	
	"MY_ORDERS": {
		"text": {"en": "🎥 Guide on How to Easily and Quickly Pay for Shipping (Cargo)!", "ru": "🎥 Инструкция по быстрой и удобной оплате за доставку (карго)!", "uz": "🎥 Yo‘l haqi (kargo) to‘lovlarini to‘lashni oson va tezroq amalga oshirish bo‘yicha ko‘rsatma!", "zh": "🎥 快速便捷支付运费（货运）指南！"}, 
		"photo": ["", ""], 
		"video": {
			"abusahiyVideo": {"uz": "BAACAgIAAxkBAAEWFxtoEMQdQ5GmkP9AESqqbcr77USz6wACaWwAAunhgEgde317wDjYsTYE", "ru": "", "en": "", "zh": ""}, 
			"ipostVideo": {"uz": "BAACAgIAAxkBAAECSdlodN-MwYP6UQZEWQ8BIvYiEMQy1gACaWwAAunhgEgybWgObuqZkDYE", "ru": "", "en": "", "zh": ""}
		}
	},
		
	
	"ADD_ADDRESS": {
		"text": {"en": "", "ru": "", "uz": "", "zh": ""}, 
		"photo": ["", ""], 
		"video": {
			"abusahiyVideo": {"uz": "BAACAgIAAxkBAAEWwpxoFJg6Dg5QnPqLtWELv3Tw_TlDtAACeHoAAieXoUgI2u-utD72qjYE", "ru": "", "en": "", "zh": ""},
			"ipostVideo": {"uz": "BAACAgIAAxkBAAIvH2hICaTUdSSpbfK-YxSnE_7piPAgAAJ1cQACb85BSs2TEL9Z4rjYNgQ", "ru": "", "en": "", "zh": ""}
		}
	}, 
	
	"CALL_CENTER": {
		"text": {"en": "<b>Frequently Asked Questions (FAQs)</b>\n\n<b>General Information</b>\n\n❓ Question: What is \" iPost \"?\n✔️ Answer: <i>This platform simplifies purchasing products from Chinese websites such as Taobao, Pinduoduo, and others.</i>\n\n❓ Question: How long does delivery take? \n✔️ Answer: <i>After arriving at our warehouse in China, delivery takes an average of 10–14 days..</i>\n\n<b>Registration</b>\n\n❓ Question: What is an ID code, and how can I get one?\n✔️ Answer: <i>This code is provided by us. We identify your packages through this code. You can get your ID code via our Bot. More details: @ipostuzbot</i>\n\n❓ Question: How do I register?\n✔️ Answer: <i>Through the Telegram bot. Open @ipostuzbot and press the start button to access all instructions.</i>\n\n❓ Question: What is a TRACKING CODE, and where can I get it?\n✔️ Answer: <i>When items purchased from Chinese online stores arrive at our Chinese warehouse, a tracking number (TRACKING CODE) is issued. You must enter this code in the Telegram bot. This code helps us receive the packages and ship them to Uzbekistan.</i>\n\n<b>Payments</b>\n\n❓ Question: How much is the shipping fee per kilogram?\n✔️ Answer: <i>$6 per kg.</i>\n\n❓ Question: How do I pay for the shipping fee?\n✔️ Answer: <i>You can pay via the \"card number\" or \"Payme QR code\" linked in the Telegram bot. Go to the \"Unpaid packages\" section in the bot to see the amount due in Uzbekistani som.</i>\n\n<b>About Shipments</b>\n\n❓ Question: What items are allowed and prohibited?\n✔️ Answer: <i>Medical equipment, color-changing liquids, drones... <a href='https://t.me/ipostcargo/2'>More details</a></i>\n\n❓ Question: How do I know when my package arrives at the Chinese warehouse or is shipped to Uzbekistan?\n✔️ Answer: <i>Once you enter your tracking code in the bot, you will see the package status, including whether it has been received, shipped to Uzbekistan, and its current location.</i>\n\n❓ Question: Where can I collect my package once it arrives in Uzbekistan?\n✔️ Answer: <i>To ensure convenience for our customers, we deliver your packages to distribution points in major cities and regional centers.</i>\n\n❓ Question: What is oversized cargo? Do you handle it?\n✔️ Answer: <i>Oversized cargo refers to large but lightweight items. Additional charges apply in such cases. The average rate is 170 kg per cubic meter or 17 kg per 0.1 cubic meter.</i>\n\n❓ Question: My package arrived damaged or broken.\n✔️ Answer: <i>Take a picture of the damaged item and send it to the Chinese seller. Request a refund or a replacement item.</i>\n\n<b>Delivery</b>\n\n❓ Question: Will my package be delivered to my home?\n✔️ Answer: <i>Yes, based on your request, you can either collect your package from a nearby distribution center or have it delivered to your home. Additional fees will be charged according to postal service rates.</i>\n\n<blockquote>For questions and inquiries, please call the following numbers during working hours:</blockquote>\n\n👨‍💻 ‍ Operator: \n💬 @iPost_help  \n💬 @iPost001  \n💬 @iPost002                                                                                                 💬 @iPost003", "ru": "<b> Часто задаваемые вопросы (FAQs) </b>\n\n<b> Общая информация </b>\n\n❓ Вопрос: Что такое \" iPost \"?  \n✔️ Ответ: <i>Эта платформа упрощает покупку товаров с китайских сайтов, таких как Taobao, Pinduoduo и других.</i>  \n\n❓ Вопрос: Через сколько дней приходит заказ?  \n✔️ Ответ: <i>После поступления на наш китайский склад, доставка в среднем занимает 10–14 дней..</i>  \n\n<b> Регистрация </b>\n\n❓ Вопрос: Что такое ID-код и как его получить?  \n✔️ Ответ: <i>Этот код выдается нами. Он помогает нам идентифицировать, что посылка принадлежит именно вам. Получить ID-код можно через наш бот. Подробнее: @ipostuzbot</i>  \n\n❓ Вопрос: Как зарегистрироваться?  \n✔️ Ответ: <i>Через Telegram-бота. Откройте @ipostuzbot и нажмите кнопку \"Старт\", чтобы увидеть все инструкции.</i>  \n\n❓ Вопрос: Что такое TREK-КОД и где его взять?  \n✔️ Ответ: <i>Когда заказанный товар отправляется в наш китайский склад, ему присваивается трек-номер (TREK-КОД). Вам необходимо ввести этот код в Telegram-бот. По этому коду мы принимаем посылки и отправляем их в Узбекистан.</i>  \n\n<b> Оплата </b>\n\n❓ Вопрос: Сколько стоит доставка за 1 кг?  \n✔️ Ответ: <i>6$ за 1 кг.</i>\n\n❓ Вопрос: Кому и как оплатить стоимость доставки?  \n✔️ Ответ: <i>Оплата производится через привязанный к Telegram-боту номер карты или Payme QR-код. В разделе \"Неоплаченные посылки\" в боте отобразится сумма к оплате в национальной валюте – сум.</i>  \n\n<b> О грузе </b>\n\n❓ Вопрос: Какие товары можно заказывать, а какие нельзя?  \n✔️ Ответ: <i>Медицинские приборы, жидкости с изменяющимся цветом, дроны... <a href='https://t.me/ipostcargo/2'>Подробнее</a></i>  \n\n❓ Вопрос: Как узнать, что моя посылка прибыла на склад в Китае или отправлена в Узбекистан?  \n✔️ Ответ: <i>При вводе трек-кода в боте отобразится статус груза: получен ли он, отправлен в Узбекистан и где находится.</i>  \n\n❓ Вопрос: Где забрать груз в Узбекистане?  \n✔️ Ответ: <i>Для удобства наших клиентов мы доставляем посылки в пункты выдачи в городах и областях.</i>  \n\n❓ Вопрос: Что такое габаритный груз? Вы его принимаете?  \n✔️ Ответ: <i>Габаритный груз – это объемный, но легкий груз. В таком случае взимается дополнительная плата. В среднем 1 куб = 170 кг, 0.1 куб = 17 кг.</i>  \n\n❓ Вопрос: Что делать, если моя посылка пришла поврежденной?  \n✔️ Ответ: <i>Сфотографируйте поврежденный товар и отправьте фото китайскому продавцу. Вы можете запросить возврат средств или замену товара.</i>  \n\n<b> Доставка </b>\n\n❓ Вопрос: Можно ли заказать доставку до дома?  \n✔️ Ответ: <i>Да, по вашему желанию вы можете забрать груз в ближайшем пункте выдачи или заказать доставку на дом. Дополнительная плата взимается согласно тарифам почтовой службы.</i>  \n\n<blockquote> По вопросам и обращениям звоните в рабочее время: </blockquote>  \n\n👨‍💻 Оператор:  \n💬 @iPost_help  \n💬 @iPost001  \n💬 @iPost002                                                                                                 💬 @iPost003                     ", "uz": "<b> Ko‘p so‘raladigan savollar (FAQs)</b>\n\n<b>Umumiy ma'lumot</b>\n\n❓ Savol: \" iPost \" o‘zi nima?\n✔️ Javob: <i>Ushbu platforma Xitoyning Taobao, Pinduoduo va boshqa saytlaridan mahsulot sotib olishni \n osonlashtiradi.</i>\n\n❓ Savol: Nechchi kunda yetib keladi? \n✔️ Javob: <i>Xitoy omboriga yetib borgandan so'ng , o'rtacha 10-14kunda yetib keladi</i>\n\n<b>Registratsiya</b>\n\n❓ Savol: ID kod nima uni qanday olaman?\n✔️ Javob: <i>Bu kod biz tomonimizdan beriladi. Yuklar aynan sizga tegishli ekanini biz, ana shu kodingiz orqali bilamiz. ID kodni siz Bot orqali olasiz. batafsil ma`lumot: @ipostuzbot</i>\n\n❓ Savol: Qanday ro`yxatdan o`taman?\n✔️ Javob: <i>Telegram bot orqali. @ipostuzbot Shunga kirib start tugmasini bossangiz, barcha qo`llanmalar ko`rinadi.</i>\n\n❓ Savol: TREK KOD nima, uni qayerdan olaman ?\n✔️ Javob: <i>Xitoy internet do`konlaridan olingan tovarlar bizning xitoydagi omborimizga yuborilganda (kuzatuv raqami) TREK KOD beriladi. Uni telegram botga kiritishingiz zarur. Shu kod asosida biz junatmalarni qabul qilib olamiz va O`zbekistonga jo`natamiz.</i>\n\n<b>To`lov haqida</b>\n\n❓ Savol: Kargo puli kilogrammiga nechpul?\n✔️ Javob: <i>1 kilogrammiga 6$ .</i>\n\n❓ Savol: Kargo (yo`l haqini) kimga qanday to`layman?\n✔️ Javob: <i>Telegram botga biriktirilgan \"karta raqam\" yoki \"Payme qr kodi\" orqali to`lov qilasiz. Botdagi To`lanmagan yuklar bo`limiga bossangiz, to`lashingiz kerak bo`lgan narx milliy valyutamiz - so`mda chiqadi</i>\n\n<b>Yuk haqida</b>\n\n❓ Savol: Nimalar mumkin, nimalar mumkin emas?\n✔️ Javob: <i>Tibbiyot anjomlari, rangi o`zgaruvchan suyuqliklar, dronlar... <a href='https://t.me/ipostcargo/2'>Batafsil</a></i>\n\n❓ Savol: Yuklarim Xitoy omboriga yetib borganini, O`zbekistonga junatilganini qayerdan bilaman?\n✔️ Javob: <i>Yuklarizni trek kodini botga kiritganizda, sizga tovar holati, ya`ni qabul bo`lgani,  O`zbekistonga jo`natilgani va qayerga yetgani ko`rinib turadi. </i>\n\n❓ Savol: Yuklarim O`zbekistonga kelganida qayerdan olaman?\n✔️ Javob: <i>Biz barcha mijozlarimizni o`ylagan holda, sizning yuklaringizni viloyat, shahar markazlaridagi yuk tarqatish punklarigacha yetkazib beramiz.</i>\n\n❓ Savol: Gabarit yuk nima? Sizlarda ham bormi?\n✔️ Javob: <i>Yukni hamji katta lekin  o`zi yengil. Shunday holatda qo`shimcha to`lov olinadi. O`rtacha hisob 1 kub uchun 170 kg.__ 0.1 kub uchun 17 kg</i>\n\n❓ Savol: Yukim sinib, buzilib keldi.\n✔️ Javob: <i>Singan yukingizni rasmga olib, Xitoylik sotuvchiga jo`natasiz va pulini to`lab berishini yoki o`rniga boshqa tovar jo`natishini aytasiz.</i>\n\n<b>Dostavka haqida</b>\n\n❓ Savol: Yukimni uyimgacha olib kelishadimi?\n✔️ Javob: <i>Albatta, sizning talabingizga ko`ra, yuklaringizni sizga yaqin hududdagi tarqatish punktidan borib olishingiz, yoki uyingizgacha yetkazib berishlarini so`rashingiz mumkin. Bunda qo`shimcha haq, pochta kompaniyasining tariflariga ko`ra amalga oshiriladi.</i>\n\n\n<blockquote>Savol va murojaatlar uchun quyidagi raqamlarga ish vaqtlarida qo'ng'iroq qiling:</blockquote>\n\n👨‍💻 ‍ Operator: \n💬 @iPost_help\n💬 @iPost001\n💬 @iPost002                                                                                                                     💬 @iPost003", "zh": "<b>常见问题 (FAQs)</b>\n\n<b>一般信息</b>\n\n❓ <b>问题：\"iPost\" 是什么？</b>\n✔️ <b>回答：</b> <i>该平台简化了从淘宝、拼多多等中国网站购买商品的过程。</i>\n\n❓ <b>问题：配送需要多长时间？</b>\n✔️ <b>回答：</b> <i>平均12-14天。</i>\n\n<b>注册</b>\n\n❓ <b>问题：ID代码是什么？我怎样获得它？</b>\n✔️ <b>回答：</b> <i>该代码由我们提供。我们通过此代码确认您的包裹。您可以通过我们的Bot获得ID代码。更多详情：@ipostuzbot</i>\n\n❓ <b>问题：我怎样注册？</b>\n✔️ <b>回答：</b> <i>通过Telegram机器人。打开 @ipostuzbot 并点击开始按钮，以获取所有指导信息。</i>\n\n❓ <b>问题：跟踪码是什么？我在哪里能获取？</b>\n✔️ <b>回答：</b> <i>当从中国网站购买的商品送达我们在中国的仓库时，将给予跟踪号 (TRACKING CODE)。您需要将此码输入Telegram机器人。此码帮助我们接收包裹并发送至乌兹别克斯坦。</i>\n\n<b>付款</b>\n\n❓ <b>问题：每千克的配送费用是多少？</b>\n✔️ <b>回答：</b> <i>每千克6美元。如果您在包裹到达乌兹别克斯坦后付款，费用为7美元。</i>\n\n❓ <b>问题：我怎样付款？</b>\n✔️ <b>回答：</b> <i>您可以通过Telegram机器人链接的\"卡号\"或\"Payme QR码\"进行付款。进入机器人中的\" 未付款包裹 \"部分以查看需要付款的总金额。</i>\n\n<b>下载和迁移包裹</b>\n\n❓ <b>问题：哪里可以预览我的包裹信息？</b>\n✔️ <b>回答：</b> <i>将跟踪码输入Telegram机器人，将显示包裹状态，包括是否已接收，是否已发送到乌兹别克斯坦，以及当前位置。</i>\n\n<b>交付信息</b>\n\n<blockquote>如有问题或查询，请在工作时间打电话至以下号码：</blockquote>\n\n👨‍💻 操作员：  \n💬 @iPost_help  \n💬 @iPost001  \n💬 @iPost002                                                                                                 💬 @iPost003"}, 
		"photo": ["", ""], 
		"video": {
			"abusahiyVideo": {"uz": "", "ru": "", "en": "", "zh": ""},
			"ipostVideo": {"uz": "", "ru": "", "en": "", "zh": ""}
		}
	}, 
	
	"SEARCH_ORDER": {
		"text": {"en": "", "ru": "", "uz": "", "zh": ""}, 
		"photo": ["", ""], 
		"video": {
			"abusahiyVideo": {"uz": "BAACAgIAAxkBAAJD4WdaqpMjZVtZNqR-vHwdIAAB_VGeGgACllUAApYCwEq7StMl_eb2OzYE", "ru": "", "en": "", "zh": ""},
			"ipostVideo": {"uz": "BAACAgIAAxkBAAIuu2hH9kyY0uovGIbevC-cU4ktcsXjAALIbAACg3hBSifb4vy9o4OtNgQ", "ru": "", "en": "", "zh": ""},
		}
	}, 
	
	"CHINA_ADDRESS": {
		"text": {"en": "<b>Don't know how to enter an address on online platforms like Taobao and 1688? 📍</b>\n\nWatch the following videos and learn how to enter your address correctly:\n👉 Pinduoduo guide: <a href='https://t.me/ipostcargo/120'>Video link</a>\n👉 1688 guide: <a href='https://t.me/ipostcargo/121'>Video link</a>\n\n<blockquote>Make sure to enter your address correctly to receive your orders on time!</blockquote>", "ru": "<b>Не знаете, как ввести адрес на онлайн-платформах, таких как Taobao и 1688? 📍</b>\n\nПосмотрите следующие видео и узнайте, как правильно ввести свой адрес:\n👉 Руководство по Pinduoduo: <a href='https://tme/ipostcargo/120'>Ссылка на видео</a>  \n👉 Руководство по 1688: <a href='https://tme/ipostcargo/121'>Ссылка на видео</a>  \n\n<blockquote>Убедитесь, что ввели адрес правильно, чтобы получить заказы вовремя!</blockquote>", "uz": "<b>Online platformalarda, jumladan Taobao va 1688 ilovalarida manzilni qanday kiritishni bilmayapsizmi? 📍</b>\n\nQuyidagi videolarni tomosha qiling va manzil kiritishni bilib oling:\n👉 Pinduoduo uchun qo‘llanma<a href='https://tme/ipostcargo/120'>Video havolasi</a>:  Video havolasi</a>\n👉 1688 uchun qo‘llanma: <a href='https://tme/ipostcargo/121'>Video havolasi</a>\n\n<blockquote>Manzillarni kiritishda xato qilmang va buyurtmalaringizni o‘z vaqtida qabul qiling!</blockquote>", "zh": "<b>您不知道如何在 Taobao 和 1688 等在线平台上输入地址吗？📍</b>\n\n观看以下视频，了解如何正确输入您的地址：  \n👉 Pinduoduo 指南：<a href='https://tme/ipostcargo/120'>视频链接</a>  \n👉 1688 指南：<a href='https://tme/ipostcargo/121'>视频链接</a>  \n\n<blockquote>请确保正确输入地址，以便及时收到您的订单！</blockquote>"}, 
		"photo": ["", ""], 
		"video": {
			"abusahiyVideo": {"uz": "BAACAgIAAxkBAAJD4WdaqpMjZVtZNqR-vHwdIAAB_VGeGgACllUAApYCwEq7StMl_eb2OzYE", "ru": "", "en": "", "zh": ""},
			"ipostVideo": {"uz": "BAACAgIAAxkBAAIuu2hH9kyY0uovGIbevC-cU4ktcsXjAALIbAACg3hBSifb4vy9o4OtNgQ", "ru": "", "en": "", "zh": ""}
		}
	}, 
	
	"UN_PAID_ORDERS": {
		"text": {"en": "", "ru": "", "uz": "", "zh": ""}, 
		"photo": ["", ""], 
		"video": {
			"abusahiyVideo": {"uz": "BAACAgIAAxkBAAJD4WdaqpMjZVtZNqR-vHwdIAAB_VGeGgACllUAApYCwEq7StMl_eb2OzYE", "ru": "", "en": "", "zh": ""},
			"ipostVideo": {"uz": "BAACAgIAAxkBAAIuu2hH9kyY0uovGIbevC-cU4ktcsXjAALIbAACg3hBSifb4vy9o4OtNgQ", "ru": "", "en": "", "zh": ""},
		},
	}, 
	
	"BANK_CARD_OR_CASH": {"card_name": "IPAK YO'LI", "card_number": "9860170105690540", "cardholder_name": "FARKHOD KHOLMURODOV"}, 
	
	"SIMPLE_CREATE_ORDER": {
		"text": {"en": "🎥 Video guide for entering the tracking number!", "ru": "🎥 Видеоруководство по вводу трек-номера!", "uz": "🎥 Trek raqam kiritish uchun video qo‘llanma!", "zh": "🎥 输入跟踪号码的视频指南！"}, 
		"photo": ["", ""], 
		"video": {
			"abusahiyVideo": {"uz": "BAACAgIAAxkBAAEXX4loGEiBmK2jwAcjjxknUG5hTPDa3gAC2G0AAqONwEjXO1AI9kooHjYE", "ru": "", "en": "", "zh": ""}, 
			"ipostVideo": {"uz": "BAACAgIAAxkBAAIvEmhICS4z_kHS2W4bPnG80EO_7324AALwbQACg3hBSjqfWnxlp_JaNgQ", "ru": "", "en": "", "zh": ""}, 
		},
	},
}














	}
}
