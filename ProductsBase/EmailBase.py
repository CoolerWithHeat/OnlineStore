import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(recipient_email, message, subject='No Subject', sender_email='pcjoker04@gmail.com', sender_password = 'asskicker2004'):
    # Create a MIME multipart message
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = subject

    # Add the message body
    msg.attach(MIMEText(message, 'plain'))

    # SMTP configuration for Gmail
    smtp_host = 'smtp.gmail.com'
    smtp_port = 587

    try:
        # Create a secure connection to the SMTP server
        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()

        # Log in to the Gmail account
        server.login(sender_email, sender_password)

        # Send the email
        server.send_message(msg)

        print('Email sent successfully!')
    except Exception as e:
        print('An error occurred while sending the email:', str(e))
    finally:
        # Close the connection to the SMTP server
        server.quit()

