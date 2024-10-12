const Alexa = require('ask-sdk-core');
const request = require('sync-request');
const { OPENAI_API_KEY } = require('./config');
const levels = ['elementary', 'high school', 'college', 'expert'];
var initialPrompt = 'Talk in a professional and informative way, keeping your replies brief.';
var catchAllList = [];

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'How complex do you want your responses to be? Elementary, high school, college, expert, or default? Say exit at any time to stop the conversation.';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)  // Add reprompt for user response
            .getResponse();
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

        function makeSyncPostRequest() {
            try {
                
                // Create an array of message objects to send to OpenAI
                let messages = [
                    { "role": "system", "content": initialPrompt }
                ];

                // Add all previous inputs from catchAllList to the messages array
                catchAllList.forEach(value => {
                    messages.push({ "role": "user", "content": value });
                });

                // Add the current catchAllValue to the messages array
                messages.push({ "role": "user", "content": catchAllValue });
                
                const response = request('POST', 'https://api.openai.com/v1/chat/completions', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + OPENAI_API_KEY,
                    },
                    body: JSON.stringify({  
                        "model": "gpt-4o-mini",
                        "messages": messages
                    })
                });

                if (response.statusCode === 200) {
                    catchAllList.push(catchAllValue);
                    const responseData = JSON.parse(response.getBody('utf8'));
                    speakOutput = responseData.choices[0].message.content;
                    console.log('Response:', speakOutput);
                } else {
                    console.error('Failed with status code:', response.statusCode);
                }
            } catch (error) {
                console.error('Error:', error.message);
            }
        }

        makeSyncPostRequest();

        const repromptOutput = 'Would you like to ask anything else?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)  // Add reprompt for user interaction
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
        const repromptOutput = 'Please ask for help if needed.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)  // Add reprompt for help intent
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
            .withShouldEndSession(true)  // End the session
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';
        const repromptOutput = 'Can you repeat that?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)  // Add reprompt for fallback intent
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        return handlerInput.responseBuilder.getResponse();  // Empty response
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;
        const repromptOutput = 'Please provide further details.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)  // Add reprompt for reflecting intent
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        const repromptOutput = 'Could you please repeat your request?';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)  // Reprompt for error handling
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();
