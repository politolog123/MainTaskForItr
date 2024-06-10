async function createTicket(){
   const mymodal = $('#helpmodal');
    if (mymodal.length==0){
        const modal = await fetch('/tiketCreationPage.html');
      const text = await modal.text(); 
       $('body').append(text)
    }
    $('#helpmodal').modal('show')
 
//   console.log(html)
}
function onclick(){
    onsubmit()
}

 async function onsubmid() {
    
    const authEmail = localStorage.getItem('email');
    const summary = document.getElementById('summary').value;
    const description = document.getElementById('description').value;
    const priority = document.getElementById('priority').value;
    const state = document.getElementById('state').value;
    const pageUrl = window.location.href;
    const currentUserAccountId = 'здесь должен быть идентификатор текущего пользователя';
    try {
        const response = await fetch('/createTicket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                description,
                summary,
                priority,
                state,
                authEmail,
                url : pageUrl,
                currentUserAccountId:currentUserAccountId,
                
                // url: window.location.href
            })
        });
        const data = await response.json();
  
        if (response.ok) {
            document.getElementById('ticketResult').innerHTML = `<div class="alert alert-success">Jira ticket created: ${data.issueKey}</div>`;
        } else {
            document.getElementById('ticketResult').innerHTML = `<div class="alert alert-danger">Error: ${data.error}</div>`;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('ticketResult').innerHTML = `<div class="alert alert-danger">An error occurred while creating the ticket.</div>`;
    }
  };
