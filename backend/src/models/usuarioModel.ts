import { Schema, model } from 'mongoose';

const usuarioSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
},
{
    timestamps: true,
    versionKey: false
});

const Usuario = model('Usuario', usuarioSchema);

export default Usuario;
