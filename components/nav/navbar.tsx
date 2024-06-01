"use client"
import Link from "next/link";
import { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import { useSession } from "next-auth/react";


export const Navbar = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const { data: session } = useSession();
    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };
    return (
        <div>
            <div className={`topnav ${isNavOpen ? "responsive" : ""}`} id="myTopnav">
                <Link style={{ width: "20%", textAlign: "left" }} href="/" className="active text-gray-900 text-semibold text-3xl">Home </Link>
                <Link style={{ width: "25%" }} href="#news">News</Link>
                <Link style={{ width: "25%" }} href="#contact">Contact</Link>
                {session ? (
                <>
                <Link style={{ width: "10%" }} href="#about">Dashboard</Link>
                <Link style={{ width: "10%" }} href="#about">Logout</Link>
                </>
                ):(
                    <>
                     <Link style={{ width: "10%" }} href="/login">Login</Link>
                <Link style={{ width: "10%" }} href="/signup">Signup</Link>
                    </>
                )
            }
                
                <Link href="#" className="icon" onClick={toggleNav}>
                    <MenuIcon
                        sx={{
                            backgroundColor: "#03A9F4",
                            color: "white",
                            transition: "background-color 0.3s",
                            '&:hover': {
                                backgroundColor: "grey",
                            }
                        }}
                    />        </Link>
            </div>
        </div>
    )
}