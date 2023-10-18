var app = angular.module('chatBot', []);

app.controller('botController', function ($scope) {

    
    let mediaRecorder;
    let recordedChunks = [];
    let stream;

    $scope.questions = [];
    $scope.questions[0] = '';
    $scope.questions[1] = '';
    $scope.questions[2] = '';


    function changeQuestions(data) {

        $scope.questions[0] = data.suggested_questions.pregunta1;
        $scope.questions[1] = data.suggested_questions.pregunta2;
        $scope.questions[2] = data.suggested_questions.pregunta3;
        $scope.$apply()

    }
      

    $scope.askQuestion = function (question) {

        if(question === undefined || question === ""){
            console.log('no input')
            return;
        }
        console.log("Question asked: " + question);
        $scope.sendMessage(question);
   
    }

    $scope.startRecording = function () {

        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(function(mediaStream) {
            
            stream = mediaStream;
            console.log('start recording')
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();

            mediaRecorder.addEventListener("dataavailable", (event) => {
              recordedChunks.push(event.data);
              console.log("data recorded: ", event.data)

              const blob = new Blob(recordedChunks, {type:'audio/wav'});

              recordedChunks = [];
      
              console.log('sending to backend');

              sendAudio(blob);

            });
          });

    }
    
    $scope.stopRecording = function() {
        
        mediaRecorder.stop();
        
        if(stream){
            stream.getTracks().forEach(function(track) {
                track.stop();
            });
        }
        
    }

    function sendAudio(blob) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", 'http://127.0.0.1:5000/sendAudio');
        xhr.setRequestHeader("Content-Type", "audio/wav");
        xhr.send(blob);

        xhr.onload = function () {
            if (xhr.status === 200) {
                console.log(xhr.response);
                var data = JSON.parse(xhr.response);

                $scope.sendMessage(data.user_input);
               

            } else {
                console.error('Error sending audio:', xhr.statusText);
            }
        };

        xhr.onerror = function () {
            console.error('Request failed');
        };

    }


    $scope.sendMessage = function (message) {

        if(message === undefined || message === ""){
            var userInput = $scope.messageText;
        }else{
            var userInput = message;
        }
      

        if(userInput === undefined || userInput === ""){
            console.log('no input')
            return;
        }

        // Make HTTP POST request to the backend endpoint

        fetch('http://127.0.0.1:5000/sendMessage', {
            method: "POST",
            body: JSON.stringify({
                "body": userInput
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(data => {
                // Handle the JSON response
                console.log(data);

                if(data.suggested_questions){
                    changeQuestions(data);
                }
             
                $scope.addToConversation(data.user_input, data.bot_response);
                userInput = "";

            })
            .catch(error => {
                // Handle any errors
                console.error('Error:', error);
            });

    };

    $scope.addToConversation = function (userInput, botResponse) {
        // Add the response to the conversation
        var chatHistory = document.getElementById('chat-history');

        var message = document.createElement('p');
        message.innerHTML = "<strong>Tu:</strong> " + userInput;

        chatHistory.appendChild(message);

        var botMessage = document.createElement('p');
        botMessage.innerHTML = "<strong>Chatbot:</strong> " + botResponse;

        chatHistory.appendChild(botMessage);

        // Clear the input field
        document.getElementById('user-input').value = "";

        // Scroll to the bottom of the chat window
        document.getElementById('chat-window').scrollTop = document.getElementById('chat-window').scrollHeight;

    }

    $scope.openChat = function () {
        document.getElementById("chat-window").style.display = "block";
      }


    $scope.closeChat = function () {
        document.getElementById("chat-window").style.display = "none";
    }


});