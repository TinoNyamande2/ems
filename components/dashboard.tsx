// "use client"
// import { signIn, signOut, useSession } from "next-auth/react"


// export const Dashboard = () => {
//     const { data: session } = useSession();
//     return (
//         <>
//             {session ? (
//                 <>
//                     <img style={{width:'5%'}} src={session.user?.image as string} />
//                     <p>Loggedin {session.user?.name}</p>
//                     <button onClick={()=>signOut()}>Signout</button>

//                 </>
//             ) : (
//                 <>
//                     <p>Not logged in</p>
//                     <button onClick={() => signIn('google')} >Sign in with Google</button>
//                     <br />
//                     <button onClick={() => signIn('github')} >Sign in with Github</button>
                    
                    
//                 </>)}
//         </>
//     )
// }