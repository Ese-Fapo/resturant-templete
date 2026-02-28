
import { Schema, model, models } from "mongoose";


const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function(pass: string) {
        return typeof pass === "string" && pass.length >= 5;
      },
      message: "A senha deve conter no mínimo 5 caracteres"
    }
  },
  
}, { timestamps: true });
        
const User = models.User || model("User", userSchema);

export default User;
