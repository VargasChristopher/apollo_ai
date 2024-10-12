/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */

const Alexa = require('ask-sdk-core');
const axios = require('axios');

//const openai = new OpenAI();
//const { OPENAI_API_KEY } = require('./config');

const endpoint = 'https://apollo-ai-main.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2024-02-15-preview'
const apiKey = 'c3fb4f705e154742bc2ad3864fe024a0'; // Azure Api key

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to Apollo AI. Which language model would you like to use? Microsoft Copilot, ChatGPT, or Meta Llama?';
        
        return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        var speakOutput = 'Hello World!';
        
        // Retrieve the value of the 'catchAll' slot
        const catchAllValue = handlerInput.requestEnvelope.request.intent.slots.catchAll.value;
        console.log('User Input:', catchAllValue);

        // function getEducationLevel() {
        //     const speakOutput = 'How complex do you want your responses to be? Elementary, high school, college, expert, or default?';
        //     const educationLevel = handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse.toLowerCase();
        //     while (!(educationLevel === 'elementary' || educationLevel === 'high school' || educationLevel === 'college' || educationLevel === 'expert' || educationLevel === 'default')) {
        //         const speakOutput = 'Please respond with either elementary, high school, college, expert, or default.';
        //         const educationLevel = handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse.toLowerCase();
        //     }

        //     if (educationLevel === 'default')
        //         return 'Talk in a professional way';

        //     return 'Make your replies at the ' + educationLevel + ' level.';    
        // }
        

        // function makeSyncPostRequest() {
        //     try {
        //         const response = request('POST', 'https://api.openai.com/v1/chat/completions', {
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 'Authorization': 'Bearer ' + OPENAI_API_KEY,
        //                 // Add any other headers if needed
        //             },
        //             body: JSON.stringify( {
        //                      "model":"gpt-3.5-turbo",
        //                      "messages": [{"role": "system", "content": getEducationLevel()},{"role": "user", "content": catchAllValue}]
        //                  })
        //         });
        
        //         // Check the response status code
        //         if (response.statusCode === 200) {
        //             // Process the response body
        //             speakOutput = JSON.parse(response.getBody('utf8'));
        //             speakOutput = speakOutput.choices[0].message.content;
        //           // const responseBody = response.choices[0].message.content;


        //             console.log('Response:', speakOutput);
        //         } else {
        //             console.error('Failed with status code:', response.statusCode);
        //         }
        //     } catch (error) {
        //         console.error('Error:', error.message);
        //     }
        // }
        // Call the function to make the synchronous API POST request
        // makeSyncPostRequest();

        try {
            const response = await axios.post(endpoint, {
                "prompt": catchAllValue,  // Pass the user's input as the prompt
                "max_tokens": 150,         // Adjust max tokens as needed
                "temperature": 0.7,        // Adjust for creative or factual responses
                "top_p": 1,
                "n": 1,
                "stop": null
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': apiKey // Azure API key
                }
            });

            // Extract the response from Azure OpenAI
            if (response.data && response.data.choices) {
                speakOutput = response.data.choices[0].text.trim();
            }
        } catch (error) {
            console.error('Error calling Azure OpenAI API:', error);
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('anything else?')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn't map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();