from flask import Flask
import subprocess

app = Flask(__name__)

@app.route('/run-python-script')
def run_python_script():
    # Specify the absolute paths to your Python script and activate script
    python_script_path = r'C:\Users\jhas0\OneDrive\Desktop\Exam-Seat-Arrangement-System-main\Exam-Seat-Arrangement-System-main\ESA-Backend\Attendance\face_detection.py'
    activate_script_path = r'C:\Users\jhas0\OneDrive\Desktop\Exam-Seat-Arrangement-System-main\Exam-Seat-Arrangement-System-main\ESA-Backend\Attendance\.venv\Scripts\activate.bat'
    
    # Activate virtual environment and execute the Python script
    command = f'call {activate_script_path} && python {python_script_path}'
    result = subprocess.run(command, capture_output=True, text=True, shell=True)
    
    print(result)
    return result.stdout

if __name__ == '__main__':
    app.run(debug=True)
