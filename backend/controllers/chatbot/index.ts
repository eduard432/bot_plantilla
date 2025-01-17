import { handleCreateChatBot, handleDeleteChatbot, handleGetChatbot, handleGetChatbots,handleUpdateChatbots} from './chatbot.controller'
import { handleAddConnection, handleDeleteConnection } from './connection.controller'
import { handleAddPlugin, handleGetPlugins, handleDeletePlugin } from './plugin.controller'
import { handleGetStats } from './statics.controller'

export {
    handleCreateChatBot,
    handleGetChatbot,
    handleGetChatbots,
    handleDeleteChatbot,
    handleUpdateChatbots,
    handleAddConnection,
    handleDeleteConnection,
    handleAddPlugin,
    handleGetPlugins,
    handleDeletePlugin,
    handleGetStats
}