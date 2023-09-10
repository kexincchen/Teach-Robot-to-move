// Fetch commands from the server when the page loads
window.onload = function() {
    console.log("start admin");
    fetch('/admin/all_commands', {
        method: 'POST'
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

// document.getElementById('addCommandForm').addEventListener('submit', function(event) {
//     event.preventDefault(); // Prevent the form from submitting the traditional way
//     console.log("add command");
//     const commandName = document.getElementById('commandName').value;

//     fetch('/admin/add_command', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ name: commandName })
//     })
//     .then(response => response.text())
//     .then(result => {
//         console.log('Command added:', result);
//         // Optionally, you can refresh the list of commands or give some feedback to the user
//     })
//     .catch(error => {
//         console.error('Error adding command:', error);
//     });
// });


function addCommand(commandName) {
    fetch('/admin/add_command', {
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
}

function deleteCommandByName(commandName) {
    fetch('/admin/delete_command', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: commandName })
    })
    .then(response => response.text())
    .then(result => {
        console.log('Command deleted:', result);
        // Optionally, refresh the list of commands or give feedback to the user
    })
    .catch(error => {
        console.error('Error deleting command:', error);
    });
}


function performSelectedOperation() {
    const commandName = document.getElementById('commandName').value;
    const selectedOperation = document.getElementById('operationSelect').value;

    if (selectedOperation === "add") {
        addCommand(commandName);
    } else if (selectedOperation === "delete") {
        deleteCommandByName(commandName);
    }
}