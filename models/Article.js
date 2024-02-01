import {Schema, model} from 'mongoose';

const articleSchema = Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        default: 'default.png'
    },
});

const articleModel = model('Article', articleSchema, 'articles');

export{
    articleModel
}