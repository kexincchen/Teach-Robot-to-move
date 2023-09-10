// Fetch commands from the server when the page loads
window.onload = function() {
    console.log("start admin");
    fetch('/all_commands', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        const commandsList = document.getElementById('commandsList');
        data.forEach(command => {
            let listItem = document.createElement('li');
            listItem.textContent = command.name;
            commandsList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching commands:', error);
    });
    
};

document.getElementById('addCommandForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way
    console.log("add command");
    const commandName = document.getElementById('commandName').value;

    fetch('/add_command', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: commandName })
    })
    .then(response => response.text())
    .then(result => {
        console.log('Command added:', result);
        // Optionally, you can refresh the list of commands or give some feedback to the user
    })
    .catch(error => {
        console.error('Error adding command:', error);
    });
});
