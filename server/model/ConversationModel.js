const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        default: ""
    },
    imageUrl: {
        type: String,
        default: ""
    },
    videoUrl: {
        type: String,
        default: ""
    },
    seen: {
        type: Boolean,
        default: false
    },
    msgByUserId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        requried: true
    }
}, {timestamps: true})

const conversationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        requried: true
    },
    receiver: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        requried: true
    },
    messages: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Message"
        }
    ],


},{timestamps: true})


const MessageModel = mongoose.model("Message", messageSchema)
const ConversationModel = mongoose.model("Conversation", conversationSchema)

module.exports = {MessageModel,ConversationModel};