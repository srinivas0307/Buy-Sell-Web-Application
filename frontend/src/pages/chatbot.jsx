import React, { useState } from "react";
import axios from "axios";

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/api/chatbot", {
                messages: newMessages
            });

            const formattedResponse = formatResponse(response.data);
            setMessages([...newMessages, { role: "assistant", content: formattedResponse }]);
        } catch (error) {
            console.error("Chatbot Error", error);
            setMessages([...newMessages, { role: "assistant", content: "Sorry, there was an error. Please try again later." }]);
        } finally {
            setLoading(false);
        }
    };

    // Function to format the response into readable HTML
    const formatResponse = (response) => {
        return response
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")  // Bold text formatting
            .replace(/\*(.*?)\*/g, "<em>$1</em>")  // Italics text formatting
            .replace(/\n/g, "<br />")  // Newline to <br />
            .replace(/\- (.*?)\n/g, "<ul><li>$1</li></ul>"); // Bullet points (converts - to <ul><li>)
    };

    return (
        <div className="chat-container">
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.role === "user" ? "user-message" : "bot-message"}>
                        <strong>{msg.role === "user" ? "You: " : "Chatbot: "}</strong>
                        <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                    </div>
                ))}
                {loading && <div className="bot-message">Typing...</div>}
            </div>

            <div className="chat-input">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask me anything..." />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatBot;
