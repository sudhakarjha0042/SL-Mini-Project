import { NavLink } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useState } from 'react';
import menu from '../assets/menu.png';
import menucollapse from '../assets/menucollapse.png';
import home from '../assets/home.png';
import room from '../assets/room.png';
import exam from '../assets/exam.png';
import seat from '../assets/seat.png';
import logout from '../assets/logout.png';
import profile from '../assets/profile.png';

const url = '/logout';

export default function NavBar() {
    const axiosPrivate = useAxiosPrivate();
    const { auth, setAuth } = useAuth();
    const [expand, setExpand] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false); // Track process state
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    window.addEventListener("resize", () => handleWidth());
    window.addEventListener("resize", () => setWindowWidth(window.innerWidth));
    const executePythonScript = async () => {
        try {
            // Start the process, set isProcessing to true
            setIsProcessing(true);

            // Make the request to mark attendance
            await axios.get('http://127.0.0.1:5000/run-python-script');

            // Reset isProcessing to false after receiving response
            setIsProcessing(false);

            // Log success message
            console.log('Successfully executed Python script');
        } catch (error) {
            // Log error message
            console.error('Error executing Python script:', error);

            // Reset isProcessing to false if an error occurs
            setIsProcessing(false);
        }
    }

    const handleWidth = () => {
        if (windowWidth < 996) {
            setExpand(false);
        } else {
            setExpand(true);
        }
    }

    const handleExpand = () => {
        setExpand(!expand);
    }

    const [isLocked, setIsLocked] = useState(false); // Track lock/unlock state

    const handleLockUnlock = async () => {
        try {
            // Send request to lock or unlock endpoint using Axios
            const response = await axios.get(isLocked ? "http://192.168.71.51/lock" : "http://192.168.71.51/unlock", {
                headers: {
                    'Content-Type': 'application/json',
                    // Add any other headers if needed
                }
            });
            if (response.status === 200) {
                // Update lock/unlock state
                setIsLocked(!isLocked);
            } else {
                console.error('Failed to toggle lock/unlock');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleLogout = async () => {
        try {
            await axiosPrivate.get(url, {
                withCredentials: true
            });
            auth.accessToken = "";
            setAuth(auth);
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={`whitespace-nowrap flex flex-col min-h-screen bg-green-medium ${expand ? "w-64" : "w-14 flex-none"}`}>
            <div className="flex flex-col h-48 ml-2 select-none">
                <img src={expand ? menucollapse : menu} alt="menu" className={`h-8 w-8 self-end cursor-pointer p-1 m-3`} onClick={handleExpand} title={`${expand ? "Collapse Navbar" : "Expand Navbar"}`} />
                <div className="flex flex-row ">
                    <img src={profile} alt="giga-chad" className={`${expand ? "rounded-full w-8 h-8 m-4 self-center" : "rounded-full w-8 h-8 ml-1 mr-4 my-1 self-center"}`} />
                    <p className={`${expand ? "mr-7 text-white font-Outfit-Medium tracking-needed self-center uppercase truncate" : "absolute left-[-999px]"}`}>{auth.user}</p>
                </div>
                <hr className="border-t border-green-light ml-5 mr-7"></hr>
            </div>

            <div className="flex flex-col h-full py-5">
                <NavLink to="home" className={({ isActive }) => isActive ? "bg-green-dark py-2 w-full flex flex-row" : "hover:bg-green-light py-2 w-full flex flex-row"}>
                    <p className={`font-Outfit-Medium tracking-needed text-white ${expand ? "mx-6" : "absolute left-[-999px]"}`}>Home</p>
                    <img src={home} alt="H" className={`${expand ? "absolute left-[-999px]" : "h-7 w-7 ml-3 mr-4 my-1"}`} title="home" />
                </NavLink>

                {/* Add NavLink for marking attendance */}
                <div className="hover:bg-green-light py-2 w-full flex flex-row">
                    <button 
                        onClick={executePythonScript} 
                        disabled={isProcessing} // Disable button while processing
                        className={`w-full flex flex-row focus:outline-none ${
                            isProcessing ? "bg-gray-400 cursor-not-allowed" : "hover:bg-green-light"
                        }`}
                    >
                        <p className={`font-Outfit-Medium tracking-needed text-white ${expand ? "mx-6" : "absolute left-[-999px]"}`}>
                            Mark Attendance
                        </p>
                        <img 
                            src={seat} 
                            alt="MA" 
                            className={`${expand ? "absolute left-[-999px]" : "h-7 w-7 ml-3 mr-4 my-1"}`} 
                            title="Mark Attendance" 
                        />
                    </button>
                </div>

                <NavLink to="manage-room" className={({ isActive }) => isActive ? " bg-green-dark py-2 w-full flex flex-row" : "hover:bg-green-light py-2 pyx-2 w-full flex flex-row"}>
                    <p className={`font-Outfit-Medium tracking-needed text-white ${expand ? "mx-6" : "absolute left-[-999px]"}`}>Manage Rooms</p>
                    <img src={room} alt="MR" className={`${expand ? "absolute left-[-999px]" : "h-7 w-7 ml-[14px] mr-4 my-1"}`} title="Manage Rooms" />
                </NavLink>

                <NavLink to="university-exam" className={({ isActive }) => isActive ? " bg-green-dark py-2 w-full flex flex-row" : "hover:bg-green-light py-2 w-full flex flex-row"}>
                    <p className={`font-Outfit-Medium tracking-needed text-white ${expand ? "mx-6" : "absolute left-[-999px]"}`}>University Exams</p>
                    <img src={exam} alt="UE" className={`${expand ? "absolute left-[-999px]" : "h-7 w-7 ml-[14px] mr-4 my-1"}`} title="University Exams" />
                </NavLink>

                <NavLink to="seat-allocation" className={({ isActive }) => isActive ? " bg-green-dark py-2 w-full flex flex-row" : "hover:bg-green-light py-2 w-full flex flex-row"}>
                    <p className={`font-Outfit-Medium tracking-needed text-white ${expand ? "mx-6" : "absolute left-[-999px]"}`}>Seat Allocation</p>
                    <img src={seat} alt="SA" className={`${expand ? "absolute left-[-999px]" : "h-7 w-7 ml-3 mr-4 my-1"}`} title="Seat Allocation" />
                </NavLink>
                Lock/Unlock Button
                {/* <div className="hover:bg-green-light py-2 w-full flex flex-row" onClick={handleLockUnlock}>
                    <p className={`font-Outfit-Medium tracking-needed text-white ${expand ? "mx-6" : "absolute left-[-999px]"}`}>{isLocked ? "Lock" : "Unlock"}</p>
                    <img src={seat} alt="SA" className={`${expand ? "absolute left-[-999px]" : "h-7 w-7 ml-3 mr-4 my-1"}`} title="Lock or Unlock" />
                </div> */}
                <a target="_blank" rel="noreferrer noopener" href="http://192.168.71.51/lock" className={({ isActive }) => isActive ? " bg-green-dark py-2 px-2w-full flex flex-row" : "hover:bg-green-light py-2 w-full flex flex-row"}>
                    <p className={`font-Outfit-Medium tracking-needed text-white ${expand ? "mx-6" : "absolute left-[-999px]"}`}>Lock</p>
                    <img src={seat} alt="SA" className={`${expand ? "absolute left-[-999px]" : "h-7 w-7 ml-3 mr-4 my-1"}`} title="Seat Allocation" />
                </a>

                <a target="_blank" rel="noreferrer noopener" href="http://192.168.71.51/unlock" className={({ isActive }) => isActive ? " bg-green-dark py-2 w-full flex flex-row" : "hover:bg-green-light py-2 w-full flex flex-row"}>
                    <p className={`font-Outfit-Medium tracking-needed text-white ${expand ? "mx-6" : "absolute left-[-999px]"}`}>Unlock</p>
                    <img src={seat} alt="SA" className={`${expand ? "absolute left-[-999px]" : "h-7 w-7 ml-3 mr-4 my-1"}`} title="Seat Allocation" />
                </a>

                <div className="flex-grow"></div> {/*adds a spacer to push logout to the bottom*/}
                <NavLink to="/" onClick={handleLogout} className="text-center hover:bg-green-light py-2 w-full">
                    <p className={`font-Outfit-Medium tracking-needed text-white ${expand ? "mx-6" : "absolute left-[-999px]"}`}>Log Out</p>
                    <img src={logout} alt="LO" className={`${expand ? "absolute left-[-999px]" : "h-7 w-7 mx-4"}`} title="Log Out" />
                </NavLink>
            </div>
        </div>
    );
}