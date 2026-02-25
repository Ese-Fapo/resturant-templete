

import { Schema } from 'mongoose';

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String,
         required: true,
        validate: {
            validator: function(pass) {
                return pass.length >= 6;
            },
            message: 'senha deve conter pelo menos 6 caracteres'
        },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
}, 

} , { timestamps: true });

export const User = model?.User || model('User', userSchema);



