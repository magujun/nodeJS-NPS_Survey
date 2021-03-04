import { NextFunction, Request, Response } from 'express';
import express from 'express';
import 'express-async-errors';
import 'reflect-metadata';
import createConnection from './database';
import { AppError } from './errors/appErrors';
import { router } from './routes';

createConnection();
const app = express();

app.use(express.json());
app.use(router);

// Enable CORS
app.use(function (request: Request, response: Response, _next: NextFunction) {
	response.header('Access-Control-Allow-Origin', 'localhost'); // match the domain you will make the request from
	response.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	_next();
});

// Handle errors
app.use(
	(err: Error, request: Request, response: Response, _next: NextFunction) => {
		if (err instanceof AppError) {
			return response.status(err.statusCode).json({
				message: err.message,
			});
		}
		return response.status(500).json({
			status: 'Error',
			message: 'Internal server error ${err.message}',
		});
		_next();
	}
);

export { app };
