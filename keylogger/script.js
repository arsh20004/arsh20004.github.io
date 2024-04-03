document.addEventListener("DOMContentLoaded", function() {

    const form = document.getElementById("surveyForm");
    const inputs = form.querySelectorAll("input[type='text']");

    inputs.forEach(input => {
        let keyDownTimestamp = 0;
        let keyUpTimestamp = 0;

        input.addEventListener("keydown", function(event) {
            if (keyDownTimestamp === 0) {
                keyDownTimestamp = Date.now();
            }
        });

        input.addEventListener("keyup", function(event) {
            keyUpTimestamp = Date.now();
            const timeBetweenKeyPress = keyUpTimestamp - keyDownTimestamp;
            recordholding(input.name, "Key Hold Time", timeBetweenKeyPress);
            keyDownTimestamp = 0; 
        });

        input.addEventListener("keypress", function(event) {
            recordTiming(input.name, "Key Press Time", Date.now());
            recordKey(input.name, "Key Pressed", event.key);
        });
    });

    function recordTiming(inputName, action, timestamp) {
        console.log(`Input '${inputName}' ${action} recorded at: ${new Date(timestamp).toLocaleString()}`);
        // You can send this data to your server or perform any other actions here
    }


    function recordKey(inputName, action, key) {
        console.log(`Input '${inputName}' ${action}: ${key}`);
        // You can send this data to your server or perform any other actions here
    }

    function recordholding(inputName, action, timestamp) {
        console.log(`Input '${inputName}' ${action} recorded for: ${timestamp} milliseconds`);
        // You can send this data to your server or perform any other actions here
    }
});
