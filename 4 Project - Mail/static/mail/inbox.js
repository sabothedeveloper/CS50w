document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');


});

function compose_email(recipient, subject, body, timestamp) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-display').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  let emails = document.querySelectorAll('.email-card')
  emails.forEach(email => {
    email.remove();
  })

    //submit form for compose email
    compose_form = document.querySelector('#compose-form')
    //first remove any current event listeners to avoid duplicating them
    compose_form.removeEventListener('submit', handleComposeFormSubmit)
    compose_form.addEventListener('submit', handleComposeFormSubmit)

  composeRecipients = document.querySelector('#compose-recipients')
  composeSubject = document.querySelector('#compose-subject')
  composeBody = document.querySelector('#compose-body')


  // Clear out composition fields or prefill them for replying
  if (recipient && subject && body) {
    composeRecipients.value = recipient;
    if (/^Re: /.test(subject)) {
      composeSubject.value = `${subject}`;
    } else {
      composeSubject.value = `Re: ${subject}`;
    }
    composeBody.value = `\n\n--------------------------------------------------------------------------------\n\non ${timestamp}, ${recipient} sent: \n\n${body}`
  } else {
    composeRecipients.value = '';
    composeSubject.value = '';
    composeBody.value = '';
  }


}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-display').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  //remove any currently displayed emails to avoid dulicating them
  let emails = document.querySelectorAll('.email-card')
  emails.forEach(email => {
    email.remove();
  })

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  console.log(mailbox)

  // GET request to display emails based on 'inbox', 'sent' or 'archived'
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(data => {
    console.log(data)
    data.forEach(email => {
      const emailCard = document.createElement('div')
      emailCard.style.border = '1px solid black'
      emailCard.addEventListener('click', () => viewEmail(email.id)) 
      const recipients = document.createElement('p')
      const sender = document.createElement('p')
      const subject = document.createElement('p')
      emailCard.className = 'email-card'
      recipients.innerHTML = `Recipients: <strong>${email.recipients}</strong>`
      subject.innerHTML = `Subject: <strong>${email.subject}</strong>`
      sender.innerHTML = `From: <strong>${email.sender}</strong>`

      if (mailbox === 'sent') {
        emailCard.appendChild(recipients)
      } else if (mailbox === 'inbox' || mailbox === 'archive') {
        emailCard.appendChild(sender)
      }
      
      emailCard.appendChild(subject)

            //add archive or unarchive button based on if in inbox or archive
            if (mailbox === 'inbox') {
              const archiveButton = document.createElement('button')
              archiveButton.addEventListener('click', (event) => {event.stopPropagation(); archive(true, email.id)})
              archiveButton.innerHTML = 'Archive'
              archiveButton.className = 'btn btn-dark'
              emailCard.appendChild(archiveButton)
            } else if (mailbox === 'archive') {
              const unarchiveButton = document.createElement('button')
              unarchiveButton.addEventListener('click', (event) => {event.stopPropagation(); archive(false, email.id)})
              unarchiveButton.innerHTML = 'Unarchive'
              unarchiveButton.className = 'btn btn-dark'
              emailCard.appendChild(unarchiveButton)
            }

      document.querySelector('#emails-view').appendChild(emailCard)

      if (!email.read) {
        emailCard.style.backgroundColor = 'white'
      } else {
        emailCard.style.backgroundColor = '#b3b3b3'
      }
    })
  })
}

function handleComposeFormSubmit(event) {
  event.preventDefault()
  fetch('/emails', {
    method:'POST',
    body: JSON.stringify({
      recipients: composeRecipients.value,
      subject:composeSubject.value,
      body: composeBody.value
    })
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .then(data => load_mailbox('sent'))
  .catch(error => console.error('Error: ', error))
 
}

function viewEmail(email_id) {
  //hide other view divs and show email-view
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-display').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  //delete any currently displayed email
  let currentEmail = document.querySelector('.email')
  if (currentEmail) {
    currentEmail.remove()
  }

  //GET request to show specific email that was clicked on
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(emailData => {
    let emailDiv = document.createElement('div')
    emailDiv.className = 'email'
    //create and add sender
    const sender = document.createElement('h4')
    sender.innerHTML = `From: ${emailData.sender}`
    emailDiv.appendChild(sender)
    //create and add recipients
    const recipients = document.createElement('h5')
    recipients.innerHTML = `To: ${emailData.recipients}`
    emailDiv.appendChild(recipients)
    //create and add timestamp
    const timestamp = document.createElement('p')
    timestamp.innerHTML = emailData.timestamp
    emailDiv.appendChild(timestamp)
    //create and add subject
    const subject = document.createElement('h5')
    subject.innerHTML = `Subject: ${emailData.subject}`
    emailDiv.appendChild(subject)
    //create and add body
    const body = document.createElement('p')
    
    body.innerHTML = emailData.body.replace(/\n/g, '<br>');
    emailDiv.appendChild(body)
    //create reply button
    const replyButton = document.createElement('button')
    replyButton.addEventListener('click', () => compose_email(emailData.sender, emailData.subject, emailData.body, emailData.timestamp));
    replyButton.innerHTML = 'Reply'
    replyButton.className = 'btn btn-success'
    emailDiv.appendChild(replyButton)

    document.querySelector('#email-display').appendChild(emailDiv)
  })
  .catch(error => console.log(`GET request error: ${error}`))

  //send PUT request to change email 'read' property to true
  fetch(`/emails/${email_id}`, {
    method:'PUT',
    headers: {
      'Content-Type': 'application/json', // Add this line
    },
    body: JSON.stringify({
      read:true
    })
  })
  .catch(error => console.log(error))
}

function archive(isArchived, email_id) {
  
  fetch(`/emails/${email_id}`, {
    method:'PUT',
    body:JSON.stringify({
      archived: isArchived ? true : false
    })
  })
  .catch(error => console.log(error))
  .finally(data => load_mailbox('inbox'))
}
