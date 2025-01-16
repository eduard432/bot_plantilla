// middlewares/validate.ts
import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

/**
 * Middleware genérico para validar datos con Zod.
 * @param schema Esquema de Zod.
 * @param property Parte de la solicitud a validar (body, params, query).
 */
export const validate = (
	schema: ZodSchema,
	property: 'body' | 'params' | 'query' = 'body'
) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req[property])

		if (!result.success) {
			res.status(400).json({
				message: 'Error de validación',
				errors: result.error.format(),
			})
			return
		}

		req[property] = result.data // Datos validados y tipados
		next()
	}
}
