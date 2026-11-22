import { IUser } from "@/types/user.types";
import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";

interface UserDocument extends Omit<IUser, "_id">, Document {
    comparePass(candidatePassword: string): boolean
}

const userSchema = new mongoose.Schema<UserDocument>({
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: [true, "Email is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Minimum 8 characters required"]
    },
    mobile: {
        type: String,
        minLength: [10, "Minimum 10 digit required"],
        maxLength: [10, "Maximum 10 digit required"]
    }
}, {
    timestamps: true
});

userSchema.pre("save", function (): void {
    if (!this.isModified("password")) return
    this.password = bcrypt.hashSync(this.password, 10);
});

userSchema.methods.comparePass = function (candidatePassword: string): boolean {
    return bcrypt.compareSync(candidatePassword, this.password)
};

const userModel = mongoose.model("User", userSchema);

export default userModel;