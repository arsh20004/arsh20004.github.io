document.addEventListener('DOMContentLoaded', () => {
    const messages = document.querySelector('#messages');
    messages.style.display = 'none';
    const submitButton = document.querySelector('#submitButton');
    submitButton.addEventListener('click', submitForm);
});
async  function submitForm() {
    const name = document.querySelector('#name').value.trim();
    const feedback = document.querySelector('#feedback').value.trim();
    if (name || feedback) {
        const data = {
        name: name,
        feedback: feedback
        };
        try {
            const response = await fetch('https://comp165rocks-default-rtdb.firebaseio.com/chatMsg.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Error saving data');
            }
            hideForm();
            hideFormFetchDataWithAsyncAwait();
        } catch (error) {
            console.error('Error saving data: ', error.message);
        }
    } else {
        alert('Please fill in the field of course feedback.');
    }

}
function hideForm() {
    const submitForm = document.querySelector('#submitForm');
    const messages = document.querySelector('#messages');

    submitForm.style.display = 'none';
    messages.style.display = 'block';
}
async function hideFormFetchDataWithAsyncAwait() {
    hideForm();
    try{
        const response = await fetch('https://comp165rocks-default-rtdb.firebaseio.com/chatMsg.json');
       if(!response.ok){
        throw new Error ('Error fetching data');}
       const data = await response.json(); 
        displayMessages(data);
       }
      catch (error) {
      console.error("Error fetching data: ",error.message);
      }



    // Add your code here to fetch data from this url:
    // 'https://fun165-98f8a-default-rtdb.firebaseio.com/chatMsg.json'
    // And present the data on the webpage.
 } 
function displayMessages(data) {
         const messageContainer = document.getElementById('messages');
         messageContainer.innerHTML = '<h1>Messages</h1>';
         for(const postId in data){
         const post = data[postId];
         const messageDiv = document.createElement('div');
         messageDiv.innerHTML = `<u><strong>Name: ${ post.name || 'Anonymous'}</strong></u> <strong>Message: ${post.feedback}</strong> `;
         messageContainer.appendChild(messageDiv);


         }


} 