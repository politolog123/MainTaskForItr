// document.getElementById('createTicketForm').addEventListener('submit', async function(event) {
//   event.preventDefault();

//   const userEmail = document.getElementById('userEmail').value;
//   const description = document.getElementById('description').value;
//   const priority = document.getElementById('priority').value;

//   try {
//     const response = await fetch('/create-jira-ticket', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ userEmail, description, priority })
//     });

//     const result = await response.json();


//     console.log('Result from server:', result);
//     if (response.ok) {
//       document.getElementById('ticketResult').innerText = `Jira ticket created: ${result.issueKey}`;
//     } else {
//       document.getElementById('ticketResult').innerText = `Error: ${result.error}`;
//     }
//   } catch (error) {
//     console.error('Fetch error:', error);
//     document.getElementById('ticketResult').innerText = 'Failed to create Jira ticket';
//   }
// });