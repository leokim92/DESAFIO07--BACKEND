import express from "express";
import UserModel from "../models/user.model.js";
const router = express.Router();

//Register:
router.post("/", async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;

    try {
        //Verify if the email is already in the db
        const userExist = await UserModel.findOne({ email: email });
        if (userExist) {
            return res.status(400).send("The email is already in use");
        }

        const role = email === "admincoder@coder.com" ? "admin" : "user";

        //Create new User:
        const newUser = await UserModel.create({ first_name, last_name, email, password, age, role });

        //Create the session:
        req.session.login = true;
        req.session.user = {...newUser._doc}

        //res.status(200).send("User created succesfully!")

        res.redirect("/profile");

    } catch (error) {
        res.status(500).send("Internal server error")
    }
})

//Login:
router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await UserModel.findOne({email:email});
        if(user) {
            if(user.password === password) {
                req.session.login = true;
                req.session.user = {
                    email: user.email,
                    age: user.age,
                    first_name: user.first_name,
                    last_name: user.last_name
                }
                res.redirect("/profile");
            } else {
                res.status(401).send("Incorrect password")
            }

        } else {
            res.status(404).send ("User not found");
        }

    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

//Logout
router.get("/logout", (req, res) => {
    if(req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login")
})

export default router;