const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Veuillez entrer votre nom s'il vous plaît!!!"]
    },
    lastname: {
        type: String,
        required: [true, "Veuillez entrer votre nom s'il vous plaît!!!"]
    },
    email: {
        type: String,
        required: [true, "Veuillez entrer votre email s'il vous plaît!!!"],
        unique: true,
        validate: [isEmail, 'Veuillez entrez un email valide!']
    },
    role: {
        type: String,
        enum: ["ADMINISTRATEUR", "UTILISATEUR"]
    },
    password: {
        type: String,
        required: true,
        minLength: [6, "Le mot de passe doit au moin contenir 6 caractères."]
    },
    img: { data: Buffer, contentType: String },
    filename: { type: String }
}, {timestamps: true});

// fire a function after doc saved to db
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// static method to login user
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        if(email !== user.email){
            throw Error("Email invalid");
        }

        if(email !== user.password){
            throw Error("Mot de passe incorrect");
        }
    }
    throw Error("Mot de passe ou email invalid");
}

const Userdata = mongoose.model('user', userSchema);
module.exports = Userdata;