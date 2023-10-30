const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");

let userMessage;

// script.js

document.addEventListener('DOMContentLoaded', function () {
  const chatbotButton = document.getElementById('chatbot-button');

  chatbotButton.addEventListener('click', function () {
      // Redirect to the chatbot page when the button is clicked
      window.location.href = '/chatbot';
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const loginButton = document.getElementById('login');

  loginButton.addEventListener('click', function () {
      // Redirect to the chatbot page when the button is clicked
      window.location.href = '/login';
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const aboutButton = document.getElementById('about');

  aboutButton.addEventListener('click', function () {
      // Redirect to the chatbot page when the button is clicked
      window.location.href = '/about';
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const logoButton = document.getElementById('logo');

  logoButton.addEventListener('click', function () {
      // Redirect to the chatbot page when the button is clicked
      window.location.href = '/';
  });
});

const questions = [
  {
    question: "Hi, how may I help you?",
    options: ["I wanna know my Prakriti"],
  },
  {
    question: "How is your Visual Features?",
    options: ["Yellow-Tinged skin", "Emaciation", "Cracked Skin", "Clear skin", "Excessive Freckles", "Excessive Black Moles", "Acne/Pimples/Boils", "Compactness of body", "Firmness of body"],
  },
  {
    question: "How is your Tactile Features?",
    options: ["Dry", "Soft Muscles", "Lax Muscles"],
  },
  {
    question: "How are your Joints?",
    options: ["Poor", "Soft joints", "Loose joints", "Firmn, Strong joints"],
  },
  {
    question: "How are your Eyes?",
    options: ["Restless", "Sharp", "Light Coloured", "White Eyes-sclera", "Raddish angles of eyes"],
  },
  {
    question: "How are your Nails?",
    options: ["Rough", "Coppery", "Pink", "Strong", "Smooth"],
  },
  {
    question: "How are your Teeth?",
    options: ["Rough", "Medium Sized", "Sensitive", "Sharp",],
  },
  {
    question: "How is your Mouth?",
    options: ["Rough", "Warm", "Bad Breath", "Moderate"],
  },
  {
    question: "How are your Palm and Sole?",
    options: ["Rough", "Soft", "Pinkish", "Smooth"],
  },
  {
    question: "How is your Hair?",
    options: ["Rough", "Brown", "Curly hairs", "Firm hairs", "Soft", "Moderate thick", "Fine"],
  },
  {
    question: "How is your Voice Assessment?",
    options: ["Dry", "Broken", "Low", "Articulate", "Medium pitch", "Clear"],
  },
  {
    question: "How is your Sleep Pattern?",
    options: ["Very light", "Intense", "Vivid", "Prone to disturbance", "Very deep sleeper"],
  },
  {
    question: "How is your Movement and Gait?",
    options: ["Quick,light movements", "Hurried movements", "Quick,light gait", "Purposeful", "Quick", "Sharp"],
  },
  {
    question: "How is your Diet and Lifestyle?",
    options: ["Poor", "Voracious eater", "Excessive thirst", "High fluid intake", "Poor appetite", "Less Thirst", "Slow eater"],
  },
  {
    question: "How are your Excretory Products?",
    options: ["Profuse sweating", "Minimal sweating", "Excretory sweating", "Excessive micturation", "Strong odor", "Yellowish colour"],
  }
];

let currentQuestion = 0;
let userPrakriti = "";

const createQuestionMessage = (question) => {
  const questionMessage = createChatLi(question.question, "incoming");
  chatbox.appendChild(questionMessage); // Append the question message

  const optionContainer = document.createElement("div"); // Create a container for options
  optionContainer.classList.add("options-container");
  question.options.forEach((option) => {
    const optionButton = document.createElement("button");
    optionButton.textContent = option;
    optionButton.classList.add("option"); // Use the correct class name here
    optionButton.addEventListener("click", () => handleUserChoice(option));
    optionContainer.appendChild(optionButton);
  });

  chatbox.appendChild(optionContainer); // Append the options container
  chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the bottom
};

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p>${message}</p>`
      : `<p><span class="material-symbols-outlined">smart_toy</span>${message}</p>`;
  chatLi.innerHTML = chatContent;
  return chatLi;
};

// Array to store user choices
const userChoices = [];

const handleUserChoice = (choice) => {
  chatbox.querySelectorAll(".options-container").forEach((container) => {
    container.style.display = "none"; // Hide options containers
  });
  if (currentQuestion != 0) {
    // Skip storing choice for the welcome message
    userChoices.push([choice]);

  }

  // userChoices.push([choice]); // Store the user's choice in the array
  const userChoiceMessage = createChatLi(`${choice}`, "outgoing");
  chatbox.appendChild(userChoiceMessage);
  sendBotResponse(choice); // Send the user's choice to the bot
};

const sendBotResponse = (userChoice) => {
  // Simulate a bot response based on user choice (replace with your logic)
  setTimeout(() => {
    if (currentQuestion < questions.length - 1) {
      currentQuestion++; // Move to the next question
      createQuestionMessage(questions[currentQuestion]);
    } else {
      chatInput.disabled = true; // Disable input after finishing questions
      console.log("User Choices:", userChoices);

      // When chat ends, send userChoices to your app.py
      fetch("/process_user_input", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userChoices })
      })
        .then((response) => {
          if (response.ok) {
            console.log("User choices sent to the backend successfully.");
            return response.json(); // Parse the JSON response
          } else {
            console.error("Failed to send user choices to the backend.");
            throw new Error("Network response was not ok");
          }
        })
        .then((data) => {
          userPrakriti = data.botResponse; // Set the user's Prakriti
          const botResponseMessage = createChatLi(data.botResponse, "incoming");
          chatbox.appendChild(botResponseMessage);
          console.log(userPrakriti);
          const words = userPrakriti.split(' ');
          userPrakriti = words[words.length - 1];
          userPrakriti = userPrakriti.trim().replace(/\.$/, ''); // Remove trailing period if it exists
          console.log(userPrakriti);
          displayRecommendations(userPrakriti);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, 500);
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  chatbox.appendChild(createChatLi(userMessage, "outgoing"));

  setTimeout(() => {
    chatbox.appendChild(createChatLi("Thinking", "incoming"));
    sendBotResponse();
  }, 600);

  chatInput.value = ""; // Clear the input field
};

sendChatBtn.addEventListener("click", handleChat);

// Listen for the Enter key (key code 13)
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleChat();
  }
});

// Start the chat by displaying the first question
// createQuestionMessage(questions[currentQuestion]);

function displayRecommendations(userPrakriti) {
  const prakritiData = {
    Vata: {
      lifestyleRecommendations: ["Ensure you get enough restful sleep.", "Keep warm, as Vata types are sensitive to cold."],
      yogaSuggestions: ["Child's Pose (Balasana)", "Corpse Pose (Savasana)", "Camel Pose (Ustrasana)"],
      productSuggestions: ["Balarishta(Arishtam)", "Dhanwantharam Kwath"],
      medicineSuggestions: ["Ashwagandha", "Triphala"],
    },
    Pitta: {
      lifestyleRecommendations: ["Consume foods that have a cooling effect on the body, such as sweet, bitter, and astringent tastes.", "Implement stress-reduction techniques, like meditation, deep breathing exercises, and spending time in nature."],
      yogaSuggestions: ["Seated Forward Bend (Paschimottanasana)", "Bridge Pose (Setu Bandha Sarvangasana)"],
      productSuggestions: ["Alsactil Tablet", "Mahathikthaka Gritham Capsules"],
      medicineSuggestions: ["Aloe Vera Gel", "Shatavari"],
    },
    Kapha: {
      lifestyleRecommendations: ["Consume warm, light, and spicy foods.Limit dairy, sweets, and heavy, oily, or fried foods", "Engage in regular physical activity, such as brisk walking, to stimulate circulation."],
      yogaSuggestions: ["Surya Namaskar (Sun Salutation)", "Uttanasana (Forward Bend)"],
      productSuggestions: ["Tuss Nil Syrup", "Dasamoola - kaduthrayam Kwath Tablet"],
      medicineSuggestions: ["Triphala Churna", "Tulsi (Holy Basil) Tea"],
    },
  };

  const userRecommendations = prakritiData[userPrakriti].lifestyleRecommendations;
  const userYogaSuggestions = prakritiData[userPrakriti].yogaSuggestions;
  const userProductSuggestions = prakritiData[userPrakriti].productSuggestions;
  const userMedicineSuggestions = prakritiData[userPrakriti].medicineSuggestions;

  const recommendationsSection = document.querySelector(".Recommendations");
  const recommendationsHeader = recommendationsSection.querySelector("header h2");
  const recommendationsContent = document.createElement("ul");

  recommendationsHeader.textContent = "Lifestyle Recommendations & Yoga Suggestions";

  userRecommendations.forEach((recommendation) => {
    const p = document.createElement("li");
    p.textContent = recommendation;
    recommendationsContent.appendChild(p);
  });

  userYogaSuggestions.forEach((suggestion) => {
    const p = document.createElement("li");
    p.textContent = suggestion;
    recommendationsContent.appendChild(p);
  });

  recommendationsSection.appendChild(recommendationsContent);

  const suggestionsSection = document.querySelector(".Suggestions");
  const suggestionsHeader = suggestionsSection.querySelector("header h2");
  const suggestionsContent = document.createElement("ul");

  suggestionsHeader.textContent = "Product & Medicine Suggestions";

  userProductSuggestions.forEach((product) => {
    const p = document.createElement("li");
    p.textContent = product;
    suggestionsContent.appendChild(p);
  });

  userMedicineSuggestions.forEach((medicine) => {
    const p = document.createElement("li");
    p.textContent = medicine;
    suggestionsContent.appendChild(p);
  });

  suggestionsSection.appendChild(suggestionsContent);
}

createQuestionMessage(questions[currentQuestion]);
