const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyCe60ahc7ogyOuDKozglQ13wbTxPWAGqfo");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.use(express.json());

router.post('/', async (req, res) => {
    try {
        const { messages } = req.body;
        //extract the msg under contentin the messages json 
        const request = messages[messages.length - 1].content;
        console.log(request);
        const result = await model.generateContent(request);
        console.log(result.response.text());
        res.status(200).json( result.response.text());
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generating response' });
    }
});

module.exports = router;