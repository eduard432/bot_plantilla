import { RequestHandler } from "express"
import { aiPlugins } from "../../ai/plugins"

export const handleGetPlugins: RequestHandler = async (req, res) => {
    try {
        const plugins = Object.keys(aiPlugins)

        res.json({plugins})
    } catch (error) {
        console.log(error)
        res
            .json({
                msg: 'Error',
            })
            .status(501)
    }
}