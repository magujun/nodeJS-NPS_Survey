import nodemailer, { Transporter } from 'nodemailer';
import fs from 'fs';
import handlebars from 'handlebars';

class sendMailService {
	private client: Transporter;

	constructor() {
		nodemailer.createTestAccount().then((account) => {
			const transporter = nodemailer.createTransport({
				host: 'smtp.ethereal.email',
				port: 587,
				secure: false, // true for 465, false for other ports
				auth: {
					user: account.user, // generated ethereal user
					pass: account.pass, // generated ethereal password
				},
			});
			this.client = transporter;
		});
	}

	// async execute(to: string, subject: string, body: string) {
	//   const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");
	//   const templateFileContent = fs.readFileSync(npsPath).toString("utf8");

	// async execute(to: string, subject: string, body: string, path: string) {
	async execute(to: string, subject: string, variables: Record<string, unknown>, path: string) {
		const templateFileContent = fs.readFileSync(path).toString('utf8');
		const mailTemplateParse = handlebars.compile(templateFileContent);

		const html = mailTemplateParse(variables);
		// const html = mailTemplateParse({
		//   name: to,
		//   title: subject,
		//   description: body,
		// });

		const message = await this.client.sendMail({
			to,
			subject,
			html,
			from: 'NPS <noreply@nps.com.br>',
		});
		console.log('Message sent: %s', message.messageId);
		// Preview only available when sending through an Ethereal account
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
	}
}

export default new sendMailService();

// export { SendMailService };
