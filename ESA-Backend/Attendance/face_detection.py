from datetime import datetime, timedelta
import pandas as pd
import cv2
import numpy as np
import os
import face_recognition
import urllib.request
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import ssl
import pymongo
import datetime


print("called")
# Path to the image folder
path = r'image_folder'

# URL of the IP camera
ip_cam_url = 'http://172.20.10.4/cam-hi.jpg'

# Path to the attendance directory
attendance_dir = os.path.join(os.getcwd(), 'attendance')

# Function to check if the IP camera is available
def is_ip_camera_available(url):
    try:
        urllib.request.urlopen(url)
        return True
    except:
        return False

# If IP camera is not available, use internal webcam
if not is_ip_camera_available(ip_cam_url):
    cap = cv2.VideoCapture(0)
else:
    cap = None  # Placeholder for later use

# Check if attendance file exists, if yes, remove it
if 'Attendance.csv' in os.listdir(attendance_dir):
    os.remove(os.path.join(attendance_dir, "Attendance.csv"))
else:
    df = pd.DataFrame(columns=['Name', 'Time', 'Email', 'ID'])
    df.to_csv(os.path.join(attendance_dir, "Attendance.csv"), index=False)

# Load images and class names
images = []
classNames = []
for cl in os.listdir(path):
    curImg = cv2.imread(os.path.join(path, cl))
    images.append(curImg)
    classNames.append(cl)  # Append the original file name

# Function to parse name, email id, and id from image file name
def parse_image_file_name(file_name):
    parts = file_name.split('_')
    print(parts)
    if len(parts) >= 3:  # Ensure at least three parts exist
        name = parts[0]
        email_id = parts[1]
        id = parts[2].split('.')[0]
        return name, email_id, id
    else:
        return None, None, None


# Function to find face encodings
def findEncodings(images):
    encodeList = []
    for img in images:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        encode = face_recognition.face_encodings(img)[0]
        encodeList.append(encode)
    return encodeList

encodeListKnown = findEncodings(images)
print('Encoding Complete')


def send_email(receiver_email,name):
    parts = name.split('_')
    name = parts[0]
    print(receiver_email)
    print("Email Sent Succsfully...")
    sender_email = "gokhruutkarsh2122@ternaengg.ac.in"  # Enter your email address
    password = "@Utkarsh0604"  # Enter your email password

    # Create message container - the correct MIME type is multipart/alternative
    msg = MIMEMultipart('alternative')
    msg['Subject'] = "Attendance Marked"
    msg['From'] = sender_email
    msg['To'] = receiver_email

    # Create the body of the message (a plain-text and an HTML version)
    text = "Hi there,\n{name} Your attendance has been marked."
    text = text.format(name=name)

    # Record the MIME types of both parts - text/plain and text/html.
    part1 = MIMEText(text, 'plain')
    msg.attach(part1)

    # Create a secure SSL context
    context = ssl.create_default_context()

    # Send the message via SMTP server.
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, msg.as_string())

# Connect to MongoDB
client = pymongo.MongoClient("mongodb+srv://jhas0042:aja3E2MBNrWNO0ol@litethink.v9lnwqi.mongodb.net/?retryWrites=true&w=majority&appName=LiteThink")
db = client["test"]
attendance_collection = db["attendance"]

# Function to mark attendance in MongoDB
def markAttendanceInMongo(username, time_marked):
    # Get today's date
    today_date = datetime.datetime.now().strftime('%Y-%m-%d')

    # Check if the attendance for this user for today already exists
    existing_attendance = attendance_collection.find_one({"username": username, "date": today_date})

    # If the user's attendance for today already exists, do nothing
    if existing_attendance:
        return

    # If the user's attendance for today doesn't exist, insert a new document
    attendance_data = {
        "username": username,
        "attendanceMarked": True,
        "time": time_marked,
        "date": today_date
    }
    response=attendance_collection.insert_one(attendance_data)
    print("Attendance Saved in MongoDB Database", response.inserted_id)


# Function to mark attendance
# Initialize a dictionary to store the last attendance time for each person
last_attendance_time = {}

# Function to mark attendance
def markAttendance(name, email_id, id):
    attendance_file_path = os.path.join(attendance_dir, "Attendance.csv")
    now = datetime.datetime.now()
    dtString = now.strftime('%H:%M:%S')
    one_hour_ago = now - timedelta(hours=1)

    # Check if the attendance file exists, if not, create it
    if not os.path.exists(attendance_file_path):
        with open(attendance_file_path, 'w') as f:
            f.write('Name,Time,Email,ID\n')

    # Check if the attendance has already been marked for this person within the last hour
    if name in last_attendance_time and last_attendance_time[name] >= one_hour_ago:
        return  # Skip marking attendance if already marked within the last hour

    # If not marked within the last hour or file didn't exist, write to CSV
    with open(attendance_file_path, 'a+') as f:
        f.write(f'{name},{dtString},{email_id},{id}\n')

    # Update the last attendance time for this person
    last_attendance_time[name] = now
    
    # Mark attendance in MongoDB
    markAttendanceInMongo(id, dtString)

    # Send email to the student
    send_email(email_id,name)

# Main loop
attendance_marked = False  # Initialize a flag to track if attendance is marked

while True:
    if cap is not None:
        success, img = cap.read()
    else:
        # Read frame from IP camera
        img_resp = urllib.request.urlopen(ip_cam_url)
        img_np = np.array(bytearray(img_resp.read()), dtype=np.uint8)
        img = cv2.imdecode(img_np, -1)

    imgS = cv2.resize(img, (0, 0), None, 0.25, 0.25)
    imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)

    facesCurFrame = face_recognition.face_locations(imgS)
    encodesCurFrame = face_recognition.face_encodings(imgS, facesCurFrame)

    for encodeFace, faceLoc in zip(encodesCurFrame, facesCurFrame):
        matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
        faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)
        matchIndex = np.argmin(faceDis)

        if matches[matchIndex]:
            name = classNames[matchIndex]
            y1, x2, y2, x1 = faceLoc
            y1, x2, y2, x1 = y1 * 4, x2 * 4, y2 * 4, x1 * 4
            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.rectangle(img, (x1, y2 - 35), (x2, y2), (0, 255, 0), cv2.FILLED)
            cv2.putText(img, name, (x1 + 6, y2 - 6), cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)

            # Extract email id and id
            _, email_id, id = parse_image_file_name(name)

            # Mark attendance
            markAttendance(name, email_id, id)
            
            attendance_marked = True  # Set the flag to True once attendance is marked

    cv2.imshow('Webcam', img)
    key = cv2.waitKey(1)
    if key == ord('q') or attendance_marked:  # Break the loop if 'q' is pressed or attendance is marked
        break

if cap is not None:
    cap.release()
cv2.destroyAllWindows()

