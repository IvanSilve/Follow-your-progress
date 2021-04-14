const {Router} = require("express");
const {check, validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const User = require("../models/User");
const auth = require("../middleware/auth.middleware");
const router = Router();

router.post('/register',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длина пароля 6 символов')
            .isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректный данные при регистрации'
                })
            }
        const {email, password} = req.body

        const candidate = await User.findOne({ email });

        if (candidate) {
            return res.status(400).json({ message: "Пользователь уже существует"});
        }

        const hashedPassword = await bcrypt.hash(password, 9);
        const user = new User({email, password: hashedPassword});

        res.status(201).json({ message: "Зарегестрированы"})

        await user.save();


    } catch (e) {
        res.status(500).json({ message: "Попробуйте снова"})
    }
})

router.post('/login',
    [
        check("email", "Введите корректный email").isEmail(),
        check("password", "Введите пароль").exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if(!errors.isEmpty) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Некорректные данные при входе в систему"
                })
            }

            const {email, password} = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "неправильный логин или пароль"});
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(400).json({ message: "неправильный логин или пароль"});
            }

        const token = jwt.sign(
            { userId: user.id },
            config.get("jwtSecret"),
            //{ expiresIn: "1h"} //нужно прикрутить ещё и рефреш токен или хотя бы сделать логаут
        );

        res.json({ token, userId: user.id });

        } catch (e) {
            res.status(500).json({ message: "Попробуйте снова"});
        }
    })
router.post("/check", auth, async (req, res) => {
    try{
        res.status(200).json({message: "Успешная авторизация"});
    } catch (e) {
        res.status(500).json({ message: "Попробуйте снова"});
    }
})

module.exports = router;