const GeneralFunction = require('../Models/GeneralFunctionModel');
const getSessionIDs = require('../controllers/getSessionIDs');
const gf = new GeneralFunction();
const md5 = require('md5');
const nodemailer = require('nodemailer');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, './../../system.env') });

module.exports = (socket, Database) => {
    socket.on('insertNewContact', async (browserblob) => {
        const { ps_contact_name, ps_contact_email, ps_contact_department, ps_contact_issue, melody1, melody2 } = browserblob;
        const session = getSessionIDs(melody1);
        const { userID, sessionID } = session;

        if (melody2) {
            try {
                // Check for empty fields
                const result = await gf.ifEmpty([ps_contact_name, ps_contact_email]);
                if (result.includes('empty')) {
                    socket.emit(`${melody1}_insertNewContact`, {
                        type: 'caution',
                        message: 'Enter Name and Email!'
                    });
                    return;
                }

                // Create a transporter object using the specified SMTP service
                const transporter = nodemailer.createTransport({
                    host: 'jaynjewelry.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD
                    }
                });

                // Email options
                const mailOptions = {
                    from: `Pearson Specter IT Department ${process.env.EMAIL_USER}`,
                    to: 'cnikoi70@gmail.com',
                    subject: 'Email from Contact IT Department form',
                    text: `Name: ${ps_contact_name}\nEmail: ${ps_contact_email}\nUserID: ${userID}\nDepartment: ${ps_contact_department}\nIssue: ${ps_contact_issue}`
                };

                // Send the email
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('❌ Error:', error.message);
                        socket.emit(`${melody1}_insertNewContact`, {
                            type: 'error',
                            message: 'Failed to send email. Please try again later.'
                        });
                    } else {
                        console.log('✅ Email sent:', info.response);
                        socket.emit(`${melody1}_insertNewContact`, {
                            type: 'success',
                            message: 'Email Sent Successfully!'
                        });
                    }
                });
            } catch (err) {
                console.error('❌ Error:', err.message);
                socket.emit(`${melody1}_insertNewContact`, {
                    type: 'error',
                    message: 'An error occurred. Please try again later.'
                });
            }
        } else {
            socket.emit(`${melody1}_insertNewContact`, {
                type: 'caution',
                message: 'Sorry, your session has expired. Wait for about 18 seconds and try again...',
                timeout: 'no'
            });
        }
    });
};