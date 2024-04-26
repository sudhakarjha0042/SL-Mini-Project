import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

class EmailSender:
    def __init__(self):
        self.sender_email = 'gokhruutkarsh2122@ternaengg.ac.in'
        self.password = '@Utkarsh0604'
        self.server = smtplib.SMTP('smtp.gmail.com', 587)
        self.server.starttls()
        self.server.login(self.sender_email, self.password)

    def send_email(self, email, message):
        print("email called")

        # Create a multipart message and set headers
        msg = MIMEMultipart()
        msg['From'] = self.sender_email
        msg['To'] = email
        msg['Subject'] = "Your Alloted Seat Number and Room Number"

        # Add body to email
        msg.attach(MIMEText(message, 'plain'))

        # Send email    
        try:
            text = msg.as_string()
            self.server.sendmail(self.sender_email, email, text)
            print('Email sent successfully')
        except Exception as e:
            print(f'Error: {e}')

    def close(self):
        self.server.quit()
