export const forgotPasswordEmailBody = (name:string,resetLink:string) =>{
   return `<html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 60%;
                    margin-left: auto;
                    margin-right: auto;
                    background-color: #ffffff;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    padding: 20px;
                    box-sizing: border-box;
                }
                .header {
                    background-color: #007bff;
                    color: #ffffff;
                    padding: 10px 0;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                }
                .content {
                    padding: 20px;
                }
                .content p {
                    font-size: 16px;
                    line-height: 1.6;
                    text-align: center;
                }
                .button {
                    display: block;
                    width: 100%;
                    max-width: 200px;
                    margin: 20px auto;
                    padding: 10px;
                    background-color: #007bff;
                    color: #ffffff;
                    text-align: center;
                    text-decoration: none;
                    border-radius: 5px;
                    box-sizing: border-box;
                }
                .footer {
                    text-align: center;
                    font-size: 12px;
                    color: #666666;
                    padding: 10px 0;
                }
                @media (max-width: 600px) {
                    .container {
                        padding: 10px;
                    }
                    .content {
                        padding: 10px;
                    }
                    .button {
                        width: 100%;
                        padding: 15px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset</h1>
                </div>
                <div class="content">
                    <p>${name}, we have received your request to reset your EMS password</p>
                    <p>Click the button below to reset your password.</p>
                    <a href="${resetLink}" class="button">Reset Password</a>
                    <p>Please not this link expires after 1 hour</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Your Company. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>`
}

export const inviteEmailBody = (fromOrganisation:string,inviteLink:string,toEmail:string) =>{
    return `<html>
         <head>
             <style>
                 body {
                     font-family: Arial, sans-serif;
                     background-color: #f4f4f4;
                     margin: 0;
                     padding: 0;
                 }
                 .container {
                     width: 60%;
                     margin-left: auto;
                     margin-right: auto;
                     background-color: #ffffff;
                     box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                     padding: 20px;
                     box-sizing: border-box;
                 }
                 .header {
                     background-color: #007bff;
                     color: #ffffff;
                     padding: 10px 0;
                     text-align: center;
                 }
                 .header h1 {
                     margin: 0;
                 }
                 .content {
                     padding: 20px;
                 }
                 .content p {
                     font-size: 16px;
                     line-height: 1.6;
                     text-align: center;
                 }
                 .button {
                     display: block;
                     width: 100%;
                     max-width: 200px;
                     margin: 20px auto;
                     padding: 10px;
                     background-color: #007bff;
                     color: #ffffff;
                     text-align: center;
                     text-decoration: none;
                     border-radius: 5px;
                     box-sizing: border-box;
                 }
                 .footer {
                     text-align: center;
                     font-size: 12px;
                     color: #666666;
                     padding: 10px 0;
                 }
                 @media (max-width: 600px) {
                     .container {
                         padding: 10px;
                     }
                     .content {
                         padding: 10px;
                     }
                     .button {
                         width: 100%;
                         padding: 15px;
                     }
                 }
             </style>
         </head>
         <body>
             <div class="container">
                 <div class="header">
                     <h1>EMS Invite</h1>
                 </div>
                 <div class="content">
                     <p>${toEmail}, you have received an invitation to join ems from ${fromOrganisation}</p>
                     <p>Click the button below to complete the sign up</p>
                     <a href="${inviteLink}" class="button">Join</a>
                 </div>
                 <div class="footer">
                     <p>&copy; 2024 Your Company. All rights reserved.</p>
                 </div>
             </div>
         </body>
         </html>`
 }